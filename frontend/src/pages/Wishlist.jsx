import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import api from "@/lib/api";
import ProductCard from "@/components/storefront/ProductCard";

export default function Wishlist() {
  const { user } = useAuth();
  const { slugs } = useWishlist();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (slugs.length === 0) { setProducts([]); return; }
    api.get("/products?limit=200").then(r => setProducts(r.data.filter(p => slugs.includes(p.slug))));
  }, [slugs, user]);
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16" data-testid="wishlist-page">
      <p className="overline text-gold">Saved</p>
      <h1 className="serif-display text-5xl mt-3 text-navy">Your Wishlist</h1>
      {products.length === 0 ? (
        <p className="text-navy/60 mt-8">Your wishlist is empty. Tap the heart on any piece to save it here.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
