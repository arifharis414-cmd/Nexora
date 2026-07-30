import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import StarRating from "./StarRating";
import MagneticButton from "./MagneticButton";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../utils/getImageUrl";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const saved = isInWishlist(product._id);
  const finalPrice = product.finalPrice ?? product.price;
  const hasDiscount = product.discountPercent > 0;

  const flyToCart = (button) => {
    const target = document.getElementById("cart-fly-target");
    if (!target) return;

    const ghost = document.createElement("div");
    ghost.className = "cart-fly-ghost";
    document.body.appendChild(ghost);

    const buttonRect = button.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    ghost.style.left = `${buttonRect.left}px`;
    ghost.style.top = `${buttonRect.top}px`;

    requestAnimationFrame(() => {
      ghost.style.transform = `translate(${targetRect.left - buttonRect.left}px, ${targetRect.top - buttonRect.top}px) scale(0.25)`;
      ghost.style.opacity = "0";
    });

    window.setTimeout(() => ghost.remove(), 550);
  };

  const handleAddToCart = async (event) => {
    if (product.stock === 0) return;

    flyToCart(event.currentTarget);
    setAdding(true);
    try {
      await addItem(product._id, 1);
    } finally {
      window.setTimeout(() => setAdding(false), 450);
    }
  };

  return (
    <div className="group interactive-lift rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-3 shadow-[0_10px_30px_rgba(7,26,44,0.06)] backdrop-blur">
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden rounded-xl aspect-square bg-[var(--color-bg-soft)] mb-4">
        {product.images?.[0] ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[var(--color-danger)] text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:scale-110 transition-transform"
          aria-label="Toggle wishlist"
        >
          {saved ? <FaHeart className="text-[var(--color-danger)]" /> : <FaRegHeart className="text-gray-500" />}
        </button>
      </Link>

      <Link to={`/products/${product.slug}`}>
        <h3 className="font-semibold text-sm truncate hover:text-[var(--color-primary)]">{product.name}</h3>
      </Link>

      <StarRating rating={product.rating} />

      <div className="flex items-center gap-2 mt-1">
        <span className="font-bold text-[var(--color-text)]">${finalPrice}</span>
        {hasDiscount && <span className="text-sm text-gray-400 line-through">${product.price}</span>}
      </div>

      <p className={`text-xs mt-1 ${product.stock > 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
        {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
      </p>
      <p className="text-[11px] text-slate-400 mt-1">Ready to ship · Small batch</p>

      <MagneticButton
        onClick={handleAddToCart}
        disabled={product.stock === 0 || adding}
        className={`interactive-button mt-3 w-full flex items-center justify-center gap-2 bg-[var(--color-navy)] disabled:bg-gray-300 text-white text-sm py-2.5 rounded-xl hover:bg-[var(--color-primary)] ${adding ? "scale-[1.01]" : ""}`}
      >
        <FaShoppingCart size={12} className={adding ? "animate-bounce" : ""} /> {adding ? "Added" : "Add to Cart"}
      </MagneticButton>
    </div>
  );
}
