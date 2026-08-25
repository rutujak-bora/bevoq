import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/api";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { toggle, has } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const img = product.images?.[0];
  const active = has(product.slug);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login or create an account to save items to your wishlist.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    toggle(product);
  };

  const discountPercent = (product.compare_at_price && product.compare_at_price > product.price)
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col" data-testid={`product-card-${product.slug}`}>
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-[#F0EDE4] aspect-[3/4]">
        {img ? (
          <img src={img} alt={product.title} className="product-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30 font-serif text-3xl">BEVOQ</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#580018] text-gold font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-md">
              SAVE {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-navy text-white text-[9px] uppercase tracking-widest px-2 py-0.5">
              FEATURED
            </span>
          )}
        </div>

        {/* Quick Size Preview on Hover */}
        {product.sizes?.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm py-2 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between text-xs text-navy">
            <span className="text-[10px] uppercase tracking-wider text-navy/60 font-medium">Sizes:</span>
            <div className="flex gap-1.5 font-medium">
              {product.sizes.map(s => (
                <span key={s} className="px-1.5 py-0.5 bg-navy/5 rounded text-[11px]">{s}</span>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm z-10 transition-colors ${active ? "text-gold fill-gold" : "text-navy hover:text-gold"}`}
        data-testid={`wishlist-toggle-${product.slug}`}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} strokeWidth={1.5} fill={active ? "currentColor" : "none"} />
      </button>

      {/* Product Details */}
      <div className="mt-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium mb-1">
            <div className="flex items-center">
              <Star size={12} className="fill-amber-500 text-amber-500" />
            </div>
            <span>4.8</span>
            <span className="text-navy/40 font-normal">(42 reviews)</span>
          </div>

          <Link to={`/products/${product.slug}`} className="block font-serif text-base md:text-lg text-navy leading-snug hover:text-gold transition-colors" data-testid={`product-title-${product.slug}`}>
            {product.title}
          </Link>
          <div className="text-[10px] tracking-widest uppercase text-navy/50 mt-1">{product.category}</div>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <div className="text-navy font-semibold text-base" data-testid={`product-price-${product.slug}`}>
            {formatINR(product.price)}
          </div>
          {product.compare_at_price && (
            <div className="text-xs text-navy/40 line-through">
              {formatINR(product.compare_at_price)}
            </div>
          )}
          {discountPercent > 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 ml-auto">
              {discountPercent}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
