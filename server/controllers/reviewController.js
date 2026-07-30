import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Recalculates a product's average rating whenever reviews change
const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating = numReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { rating: rating.toFixed(1), numReviews });
};

// @route GET /api/reviews/:productId
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name profilePicture");
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/reviews/:productId (protected)
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: req.params.productId });
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You already reviewed this product");
    }
    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      rating,
      comment,
    });
    await recalcProductRating(req.params.productId);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/reviews/:id (protected — owner or admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized");
    }
    await review.deleteOne();
    await recalcProductRating(review.product);
    res.json({ message: "Review removed" });
  } catch (error) {
    next(error);
  }
};
