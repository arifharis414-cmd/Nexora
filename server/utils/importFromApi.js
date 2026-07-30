import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugifyModule from "slugify";

const slugify = (s) => slugifyModule(s || "", { lower: true, strict: true });

const SOURCE = process.env.PRODUCTS_SOURCE_URL;
if (!SOURCE) {
  console.error("ERROR: set PRODUCTS_SOURCE_URL in server/.env to the source API URL");
  process.exit(1);
}

const fetchAll = async (url) => {
  const results = [];
  let next = url;
  while (next) {
    console.log(`Fetching ${next}`);
    const res = await fetch(next);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const body = await res.json();
    // handle common shapes: array or { data: [], next: url }
    if (Array.isArray(body)) {
      results.push(...body);
      next = null;
    } else if (Array.isArray(body.data)) {
      results.push(...body.data);
      next = body.next || body.next_page || null;
    } else {
      throw new Error("Unsupported response shape from source API");
    }
  }
  return results;
};

const mapProduct = (src) => {
  // Map fields from source product to our Product model shape.
  // Adjust keys according to your source API.
  const name = src.name || src.title || src.product_name;
  const description = src.description || src.desc || "";
  const price = Number(src.price ?? src.amount ?? 0);
  const discountPercent = Number(src.discountPercent ?? src.discount ?? 0);
  const categoryName = src.category || src.category_name || (src.categoryObj && src.categoryObj.name) || "Uncategorized";
  const images = src.images || src.photos || (src.image ? [src.image] : []) || [];
  const stock = Number(src.stock ?? src.quantity ?? 0);
  const isFeatured = !!(src.isFeatured || src.featured);

  return { name, description, price, discountPercent, categoryName, images, stock, isFeatured };
};

const upsertCategory = async (name) => {
  const slug = slugify(name || "uncategorized");
  let cat = await Category.findOne({ slug }).exec();
  if (!cat) {
    cat = await Category.create({ name, slug, description: name });
    console.log(`Created category: ${name}`);
  }
  return cat;
};

const run = async () => {
  await connectDB();
  console.log(`Importing products from ${SOURCE}`);
  const items = await fetchAll(SOURCE);
  console.log(`Fetched ${items.length} items`);

  let created = 0;
  let updated = 0;

  for (const src of items) {
    const p = mapProduct(src);
    const cat = await upsertCategory(p.categoryName || "Uncategorized");
    const slug = slugify(p.name || `${Date.now()}`);

    const doc = {
      name: p.name,
      slug,
      description: p.description,
      specifications: p.specifications || {},
      price: p.price,
      discountPercent: p.discountPercent || 0,
      category: cat._id,
      images: p.images || [],
      stock: Number(p.stock || 0),
      isFeatured: !!p.isFeatured,
    };

    // Upsert by slug (if source includes stable ids, prefer that)
    const res = await Product.findOneAndUpdate({ slug }, doc, { upsert: true, new: true, setDefaultsOnInsert: true }).exec();
    if (res.createdAt && res.createdAt.getTime() === res.updatedAt.getTime()) created++;
    else updated++;
  }

  console.log(`Import complete. created=${created} updated=${updated}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
