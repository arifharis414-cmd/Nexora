import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useCart } from "../context/CartContext";
import * as orderService from "../services/orderService";
import toast from "react-hot-toast";

const initialForm = {
  country: "",
  address: "",
  phoneNumber: "",
};

const validateCheckoutForm = (values) => {
  const sanitizedValues = {
    country: (values.country || "").replace(/\s+/g, " ").trim(),
    address: (values.address || "").replace(/\s+/g, " ").trim(),
    phoneNumber: (values.phoneNumber || "").replace(/\s+/g, "").trim(),
  };

  const errors = {};

  if (!sanitizedValues.country) {
    errors.country = "Country is required.";
  } else if (!/^[A-Za-z ]{2,50}$/.test(sanitizedValues.country)) {
    errors.country = "Country must contain only letters and spaces (2-50 characters).";
  }

  if (!sanitizedValues.address) {
    errors.address = "Address is required.";
  } else if (sanitizedValues.address.length < 10) {
    errors.address = "Address must be at least 10 characters long.";
  } else if (!/\s/.test(sanitizedValues.address) || /^\d+$/.test(sanitizedValues.address)) {
    errors.address = "Address must be more than a single word and cannot be only numbers.";
  }

  if (!sanitizedValues.phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{11}$/.test(sanitizedValues.phoneNumber)) {
    errors.phoneNumber = "Phone number must contain exactly 11 digits.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedValues,
  };
};

export default function Checkout() {
  const { cart, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [placing, setPlacing] = useState(false);

  const shippingFee = subtotal > 100 ? 0 : 10;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shippingFee + tax).toFixed(2);
  const validation = validateCheckoutForm(form);
  const isFormValid = validation.isValid;

  // Guard against reaching checkout with nothing in the cart
  // (e.g. typing the URL directly, or the cart hasn't loaded yet)
  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add something to your cart before checking out.</p>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline">Continue shopping</Link>
      </div>
    );
  }

  const getFieldError = (field) => {
    if (!touched[field] && !submitAttempted) return "";
    return errors[field] || "";
  };

  const handleChange = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    const nextValidation = validateCheckoutForm(nextForm);
    setErrors(nextValidation.errors);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const nextValidation = validateCheckoutForm(form);
    setErrors(nextValidation.errors);
    setTouched({ country: true, address: true, phoneNumber: true });
    setSubmitAttempted(true);

    if (!nextValidation.isValid) {
      return;
    }

    setPlacing(true);
    try {
      await orderService.createOrder({ shippingAddress: nextValidation.sanitizedValues, paymentMethod: "Cash on Delivery" });
      await refreshCart();
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#ef6a52", "#7de3d0", "#071a2c"] });
      toast.success("Order placed!");
      navigate(`/profile`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="space-y-3">
        <div>
          <input
            required
            placeholder="Country"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            onBlur={() => handleBlur("country")}
            aria-invalid={Boolean(getFieldError("country"))}
            className={`w-full border rounded-lg px-4 py-2 ${getFieldError("country") ? "border-red-500" : "border-gray-200"}`}
          />
          {getFieldError("country") ? <p className="mt-1 text-sm text-red-600">{getFieldError("country")}</p> : null}
        </div>

        <div>
          <input
            required
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            onBlur={() => handleBlur("address")}
            aria-invalid={Boolean(getFieldError("address"))}
            className={`w-full border rounded-lg px-4 py-2 ${getFieldError("address") ? "border-red-500" : "border-gray-200"}`}
          />
          {getFieldError("address") ? <p className="mt-1 text-sm text-red-600">{getFieldError("address")}</p> : null}
        </div>

        <div>
          <input
            required
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
            aria-invalid={Boolean(getFieldError("phoneNumber"))}
            className={`w-full border rounded-lg px-4 py-2 ${getFieldError("phoneNumber") ? "border-red-500" : "border-gray-200"}`}
          />
          {getFieldError("phoneNumber") ? <p className="mt-1 text-sm text-red-600">{getFieldError("phoneNumber")}</p> : null}
        </div>

        <div className="border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : `$${shippingFee}`}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${tax}</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total}</span></div>
        </div>
        <button disabled={placing || !isFormValid} className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50">
          {placing ? "Placing order..." : "Place Order (Cash on Delivery)"}
        </button>
      </form>
    </div>
  );
}
