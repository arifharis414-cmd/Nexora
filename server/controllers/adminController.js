import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @route GET /api/admin/users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/admin/users/:id (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "User removed" });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id/role (admin) — promote/demote
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.role = req.body.role;
    await user.save();
    res.json({ message: "Role updated", role: user.role });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/stats (admin) — dashboard overview numbers
export const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, productCount, orderCount, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select("name stock");

    res.json({ userCount, productCount, orderCount, totalRevenue: totalRevenue.toFixed(2), lowStockProducts });
  } catch (error) {
    next(error);
  }
};
