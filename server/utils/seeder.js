import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Load configuration keys from environmental variables safely
dotenv.config();

const slugify = (str) => 
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const categoryData = [
  { name: "Watches", description: "Classic and smart watches" },
  { name: "Smartphones", description: "Latest phones from top brands" },
  { name: "Accessories", description: "Bags, cases, and everyday carry" },
  { name: "Home & Kitchen", description: "Appliances and essentials for the home" },
];

const productsByCategory = {
  Watches: [
    ["Classic Leather Watch", 89.99, 10, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
    ["Steel Chronograph Watch", 149.5, 0, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"],
    ["Minimalist Analog Watch", 59.99, 15, "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80"],
    ["Smart Fitness Watch", 129.99, 20, "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=80"],
    ["Vintage Pocket Watch", 74.0, 5, "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=900&q=80"],
    ["Titanium Sport Watch", 179.0, 12, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"],
    ["Everyday Mesh Watch", 68.5, 18, "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80"],
  ],
  Smartphones: [
    ["Galaxy Nova X12", 699.0, 10, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
    ["Pixel Lite 8", 549.0, 5, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"],
    ["iPhone-style Aura Pro", 999.0, 0, "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80"],
    ["Budget Phone A3", 199.0, 15, "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80"],
    ["Rugged Phone Explorer", 349.0, 0, "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=900&q=80"],
    ["Pro Camera Smartphone", 799.0, 8, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
    ["Compact 5G Phone", 429.0, 12, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"],
  ],
  Accessories: [
    ["Leather Wallet", 29.99, 10, "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"],
    ["Wireless Earbuds Pro", 79.99, 20, "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80"],
    ["Laptop Backpack", 49.99, 0, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
    ["Phone Case Clear Armor", 14.99, 25, "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80"],
    ["Sunglasses Retro", 34.99, 5, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"],
    ["Canvas Travel Tote", 39.99, 10, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
    ["Portable Audio Speaker", 59.99, 15, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"],
  ],
  "Home & Kitchen": [
    ["Stainless Steel Blender", 45.0, 10, "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80"],
    ["Non-stick Cookware Set", 89.0, 0, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"],
    ["Electric Kettle", 24.99, 15, "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80"],
    ["Air Fryer Compact", 69.99, 10, "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80"],
    ["Ceramic Dinner Set", 55.0, 5, "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80"],
    ["Bamboo Storage Organizer", 32.0, 10, "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"],
    ["Modern Table Lamp", 42.0, 15, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"],
  ],
};

const run = async () => {
  // Prevent execution if the connection URI hasn't been set up correctly
  if (!process.env.MONGO_URI) {
    console.error("❌ CRITICAL: Seeding terminated. MONGO_URI is missing.");
    process.exit(1);
  }

  console.log("⏳ Connecting to the database...");
  await connectDB();
  
  console.log("🧹 Clearing old data...");
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany({ role: "admin" });

  console.log("🌱 Seeding categories...");
  const categories = await Category.insertMany(
    categoryData.map((c) => ({ ...c, slug: slugify(c.name) }))
  );

  console.log("📦 Seeding products...");
  const products = [];
  for (const cat of categories) {
    const list = productsByCategory[cat.name];
    if (!list) continue;
    
    list.forEach(([name, price, discountPercent, image], idx) => {
      products.push({
        name,
        slug: slugify(name),
        description: `${name} — a great pick from our ${cat.name} collection. Quality materials, reliable performance, and a design that fits everyday life.`,
        price,
        discountPercent,
        category: cat._id,
        images: [image],
        stock: 20 + idx,
        isFeatured: idx < 2,
      });
    });
  }
  await Product.insertMany(products);

  console.log("👤 Seeding admin user (email: admin@example.com)...");
  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  console.log("✅ Seeding complete! Closing connections...");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (err) => {
  console.error("❌ Seeding failed with error:", err.message);
  try {
    await mongoose.connection.close();
  } catch (closeErr) {
    console.error("Failed to safely close connection:", closeErr.message);
  }
  process.exit(1);
});
