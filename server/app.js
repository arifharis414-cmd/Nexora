import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// --- Global middleware ---
// Support multiple local dev origins by allowing a comma-separated CLIENT_URL env var.
const rawClientUrls = process.env.CLIENT_URL || "";
const allowedOrigins = rawClientUrls.split(",").map((s) => s.trim()).filter(Boolean);
app.use(
	cors({
		origin: (origin, callback) => {
			// allow requests with no origin (mobile apps, curl, same-origin)
			if (!origin) return callback(null, true);
			if (allowedOrigins.length === 0) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	})
);
app.use(express.json()); // parses incoming JSON request bodies
app.use(morgan("dev"));  // logs each request to the console (method, path, status, time)

// Serve uploaded images statically, e.g. http://localhost:5000/uploads/abc.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// root route — quick check for requests to '/'
app.get("/", (req, res) => res.json({ message: "API root - backend running" }));

app.get("/api/health", (req, res) => res.json({ status: "Server is running" }));

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
