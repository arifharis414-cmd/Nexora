import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    specifications: { type: Map, of: String, default: {} },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 }, // e.g. 20 means 20% off
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }], // array of image URLs/paths
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual field: computed on the fly, not stored in DB
productSchema.virtual("finalPrice").get(function () {
  return +(this.price - (this.price * this.discountPercent) / 100).toFixed(2);
});
productSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Product", productSchema);
