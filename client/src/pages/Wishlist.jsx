import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { getImageUrl } from "../utils/getImageUrl";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (wishlist.products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Your wishlist is empty</h1>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
      <div className="space-y-4">
        {wishlist.products.map((p) => (
          <div key={p._id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
            <div className="w-16 h-16 bg-[var(--color-bg-soft)] rounded-lg overflow-hidden shrink-0">
              {p.images?.[0] && <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover" />}
            </div>
            <Link to={`/products/${p.slug}`} className="flex-1 font-medium hover:text-[var(--color-primary)]">{p.name}</Link>
            <span className="font-semibold">${p.finalPrice ?? p.price}</span>
            <button onClick={() => addItem(p._id, 1)} className="bg-[var(--color-primary)] text-white text-sm px-3 py-2 rounded-lg">Move to Cart</button>
            <button onClick={() => toggleWishlist(p._id)} className="text-[var(--color-danger)]"><FaTrash size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
