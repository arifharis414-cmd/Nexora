import express from "express";
import {
  getAllUsers, deleteUser, updateUserRole, getDashboardStats,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, admin); // every admin route requires login + admin role
router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

export default router;
