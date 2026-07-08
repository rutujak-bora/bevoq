import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

const STORAGE = "bevoq_wishlist";

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [slugs, setSlugs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
  });
  const [products, setProducts] = useState([]);

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(slugs)); }, [slugs]);

  useEffect(() => {
    if (user) {
      api.get("/wishlist").then(r => setProducts(r.data)).catch(() => {});
    }
  }, [user, slugs]);

  const toggle = async (product) => {
    const has = slugs.includes(product.slug);
    if (has) {
      setSlugs(s => s.filter(x => x !== product.slug));
      if (user) { try { await api.delete(`/wishlist/${product.slug}`); } catch {} }
      toast("Removed from wishlist");
    } else {
      setSlugs(s => [...s, product.slug]);
      if (user) { try { await api.post(`/wishlist/${product.slug}`); } catch {} }
      toast.success("Added to wishlist");
    }
  };

  const has = (slug) => slugs.includes(slug);

  return (
    <WishlistContext.Provider value={{ slugs, products, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}
