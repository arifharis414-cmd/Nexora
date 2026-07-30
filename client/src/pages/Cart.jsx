import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { getImageUrl } from "../utils/getImageUrl";

export default function Cart() {
  const { cart, subtotal, updateItem, removeItem } = useCart();
  const validItems = cart.items.filter((item) => item.product);
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shippingFee + tax).toFixed(2);

  if (validItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Shopping Cart</h1>
        {validItems.map((item) => {
          const price = item.product.finalPrice ?? item.product.price;
          return (
            <div key={item.product._id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
              <div className="w-20 h-20 bg-[var(--color-bg-soft)] rounded-lg overflow-hidden shrink-0">
                {item.product.images?.[0] && <img src={getImageUrl(item.product.images[0])} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-[var(--color-primary)]">{item.product.name}</Link>
                <p className="text-gray-500 text-sm">${price} each</p>
                <div className="flex items-center border border-gray-200 rounded-lg w-fit mt-2">
                  <button onClick={() => updateItem(item.product._id, Math.max(1, item.quantity - 1))} className="px-3 py-1">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => updateItem(item.product._id, item.quantity + 1)} className="px-3 py-1">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.product._id)} className="text-[var(--color-danger)] mt-2">
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-gray-100 rounded-xl p-5 h-fit">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : `$${shippingFee}`}</span></div>
          <div className="flex justify-between"><span>Tax (5%)</span><span>${tax}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
            <span>Total</span><span>${total}</span>
          </div>
        </div>
        <input placeholder="Coupon code" className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-4 text-sm" />
        <Link to="/checkout" className="block text-center bg-[var(--color-primary)] text-white py-2 rounded-lg mt-3 hover:bg-[var(--color-primary-dark)]">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
