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

const inspect = async () => {
  const ok = await connectDB();
  if (!ok) {
    console.error("DB connect failed");
    process.exit(1);
  }

  try {
    console.log("\n--- categories ---");
    const c = await Category.findOne().lean();
    console.log(JSON.stringify(c, null, 2));

    console.log("\n--- products ---");
    const p = await Product.findOne().lean();
    console.log(JSON.stringify(p, null, 2));

    console.log("\n--- users ---");
    const u = await User.findOne().lean();
    console.log(JSON.stringify(u, null, 2));

    console.log("\n--- carts ---");
    const cart = await Cart.findOne().lean();
    console.log(JSON.stringify(cart, null, 2));

    console.log("\n--- orders ---");
    const order = await Order.findOne().lean();
    console.log(JSON.stringify(order, null, 2));

    console.log("\n--- reviews ---");
    const review = await Review.findOne().lean();
    console.log(JSON.stringify(review, null, 2));

    console.log("\n--- wishlists ---");
    const wish = await Wishlist.findOne().lean();
    console.log(JSON.stringify(wish, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

inspect();
