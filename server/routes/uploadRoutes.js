import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
// Admin uploads a product image, gets back the file path to save on the Product
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ imagePath: `/uploads/${req.file.filename}` });
});

export default router;
