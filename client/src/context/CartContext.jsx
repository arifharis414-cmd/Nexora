import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      // silently ignore — e.g. token expired
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) return toast.error("Please log in to add items to your cart");
    const data = await cartService.addToCart(productId, quantity);
    setCart(data);
    toast.success("Added to cart");
  };

  const updateItem = async (productId, quantity) => {
    const data = await cartService.updateCartItem(productId, quantity);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const data = await cartService.removeFromCart(productId);
    setCart(data);
    toast.success("Removed from cart");
  };

  // Derived values components need often — computed once here instead of everywhere
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => {
    const price = i.product?.finalPrice ?? i.product?.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, itemCount, subtotal, loading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
