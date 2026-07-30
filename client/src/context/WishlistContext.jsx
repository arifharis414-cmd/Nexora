import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlist({ products: [] });
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) return toast.error("Please log in to use your wishlist");
    const isSaved = wishlist.products.some((p) => p._id === productId);
    const data = isSaved
      ? await wishlistService.removeFromWishlist(productId)
      : await wishlistService.addToWishlist(productId);
    setWishlist(data);
    toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist");
  };

  const isInWishlist = (productId) => wishlist.products.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
