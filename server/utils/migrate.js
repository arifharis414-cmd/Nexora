import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";

const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const run = async () => {
  const ok = await connectDB();
  if (!ok) return process.exit(1);

  try {
    console.log("Ensuring category slugs...");
    const categories = await Category.find().exec();
    for (const cat of categories) {
      if (!cat.slug || cat.slug.trim() === "") {
        cat.slug = slugify(cat.name || cat._id.toString());
        await cat.save();
        console.log(` - added slug for category ${cat.name}`);
      }
    }
    try {
      await Category.createIndexes();
      console.log("Category indexes ensured");
    } catch (e) {
      console.warn("Could not create category indexes:", e.message);
    }

    console.log("Ensuring product slugs...");
    const products = await Product.find().exec();
    for (const p of products) {
      if (!p.slug || p.slug.trim() === "") {
        p.slug = slugify(p.name || p._id.toString());
        await p.save();
        console.log(` - added slug for product ${p.name}`);
      }
    }
    try {
      await Product.createIndexes();
      console.log("Product indexes ensured");
    } catch (e) {
      console.warn("Could not create product indexes:", e.message);
    }

    // Seed empty collections with a safe sample if they are empty
    const user = await User.findOne().exec();
    const sampleProduct = await Product.findOne().exec();

    if (!user || !sampleProduct) {
      console.log("Skipping seeding of dependent collections — need at least one user and one product.");
    } else {
      const cartCount = await Cart.countDocuments().exec();
      if (cartCount === 0) {
        await Cart.create({ user: user._id, items: [{ product: sampleProduct._id, qty: 1 }] });
        console.log("Seeded one cart document");
      } else console.log("Carts collection not empty — skipping seed");

      const orderCount = await Order.countDocuments().exec();
      if (orderCount === 0) {
        const subtotal = sampleProduct.price;
        const shippingFee = 0;
        const tax = 0;
        const total = subtotal + shippingFee + tax;
        await Order.create({
          user: user._id,
          items: [
            {
              product: sampleProduct._id,
              name: sampleProduct.name,
              image: sampleProduct.images && sampleProduct.images[0] ? sampleProduct.images[0] : "",
              price: sampleProduct.price,
              quantity: 1,
            },
          ],
          shippingAddress: { street: "", city: "", state: "", zip: "", country: "" },
          paymentMethod: "cash",
          subtotal,
          shippingFee,
          tax,
          total,
          isPaid: false,
          status: "pending",
        });
        console.log("Seeded one order document");
      } else console.log("Orders collection not empty — skipping seed");

      const reviewCount = await Review.countDocuments().exec();
      if (reviewCount === 0) {
        await Review.create({ user: user._id, product: sampleProduct._id, rating: 5, comment: "Great product (seed)" });
        console.log("Seeded one review document");
      } else console.log("Reviews collection not empty — skipping seed");

      const wishCount = await Wishlist.countDocuments().exec();
      if (wishCount === 0) {
        await Wishlist.create({ user: user._id, products: [sampleProduct._id] });
        console.log("Seeded one wishlist document");
      } else console.log("Wishlists collection not empty — skipping seed");
    }

    console.log("Migration complete.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    process.exit(0);
  }
};

run();
