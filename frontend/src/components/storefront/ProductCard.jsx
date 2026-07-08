import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { formatINR } from "@/lib/api";

export default function ProductCard({ product }) {
  const { toggle, has } = useWishlist();
  const img = product.images?.[0];
  const active = has(product.slug);
  return (
    <div className="group relative" data-testid={`product-card-${product.slug}`}>
      <Link to={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-[#F0EDE4] aspect-[3/4]">
          {img ? (
            <img src={img} alt={product.title} className="product-img w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/30 font-serif text-3xl">BEVOQ</div>
          )}
          {product.compare_at_price && (
            <div className="absolute top-3 left-3 bg-navy text-white text-[10px] px-2 py-1 tracking-widest">SALE</div>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggle(product); }}
        className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur ${active ? "text-gold" : "text-navy hover:text-gold"}`}
        data-testid={`wishlist-toggle-${product.slug}`}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} strokeWidth={1.5} fill={active ? "currentColor" : "none"} />
      </button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/products/${product.slug}`} className="block font-serif text-lg text-navy leading-tight" data-testid={`product-title-${product.slug}`}>{product.title}</Link>
          <div className="text-[11px] tracking-widest uppercase text-navy/50 mt-1">{product.category}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-navy font-medium" data-testid={`product-price-${product.slug}`}>{formatINR(product.price)}</div>
          {product.compare_at_price && (
            <div className="text-xs text-navy/40 line-through">{formatINR(product.compare_at_price)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
