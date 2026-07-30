import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as productService from "../services/productService";
import * as reviewService from "../services/reviewService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/getImageUrl";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  const loadReviews = (productId) =>
    reviewService.getProductReviews(productId).then(setReviews).catch(() => {});

  useEffect(() => {
    setLoading(true);
    setData(null);
    productService
      .getProductBySlug(slug)
      .then((result) => {
        setData(result);
        setActiveImage(0);
        setQuantity(1);
        loadReviews(result.product._id);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!data) return <p className="text-center py-12">Product not found.</p>;

  const { product, related } = data;
  const finalPrice = product.finalPrice ?? product.price;
  const saved = isInWishlist(product._id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createReview(product._id, reviewForm);
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      loadReviews(product._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-[var(--color-bg-soft)] rounded-2xl overflow-hidden mb-3">
            {product.images?.[activeImage] ? (
              <img src={getImageUrl(product.images[activeImage])} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
            )}
          </div>
          <div className="flex gap-2">
            {product.images?.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? "border-[var(--color-primary)]" : "border-transparent"}`}>
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.rating} />
            <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold">${finalPrice}</span>
            {product.discountPercent > 0 && <span className="text-gray-400 line-through">${product.price}</span>}
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className={`text-sm mb-4 font-medium ${product.stock > 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2">+</button>
            </div>
            <button
              onClick={() => addItem(product._id, quantity)}
              disabled={product.stock === 0}
              className="flex-1 bg-[var(--color-primary)] disabled:bg-gray-300 text-white py-2 rounded-lg hover:bg-[var(--color-primary-dark)]"
            >
              Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product._id)} className="border border-gray-200 px-4 py-2 rounded-lg">
              {saved ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 && <p className="text-gray-500 mb-4">No reviews yet — be the first!</p>}
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{r.user?.name}</span>
                <StarRating rating={r.rating} size={12} />
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
        {user && (
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
              rows={3}
            />
            <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg hover:bg-[var(--color-primary-dark)]">Submit Review</button>
          </form>
        )}
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
