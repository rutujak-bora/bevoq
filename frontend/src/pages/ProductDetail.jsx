import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { formatINR } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { toggle, has } = useWishlist();

  useEffect(() => {
    setImgIdx(0);
    api.get(`/products/${slug}`).then(r => {
      setProduct(r.data);
      setSize(r.data.sizes?.[0] || null);
      setColor(r.data.colors?.[0] || null);
    });
  }, [slug]);

  if (!product) return <div className="max-w-6xl mx-auto p-20 text-navy/60">Loading...</div>;

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (product.sizes?.length && !size) { toast.error("Please select a size"); return; }
    add(product, { quantity: qty, size, color });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12" data-testid="product-detail-page">
      <div className="text-xs tracking-widest uppercase text-navy/50 mb-8">
        <Link to="/">Home</Link> / <Link to="/products">Shop</Link> / <span className="text-navy">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] bg-[#F0EDE4] overflow-hidden" data-testid="product-gallery">
            {product.images?.[imgIdx] ? (
              <img src={product.images[imgIdx]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-navy/30 font-serif text-4xl">BEVOQ</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={()=>setImgIdx(i)} className={`aspect-square overflow-hidden ${i===imgIdx ? "ring-1 ring-navy" : ""}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="overline text-gold">{product.category}</p>
          <h1 className="serif-display text-4xl md:text-5xl mt-3 text-navy" data-testid="product-title">{product.title}</h1>
          <div className="flex items-baseline gap-3 mt-4">
            <div className="text-2xl text-navy" data-testid="product-price">{formatINR(product.price)}</div>
            {product.compare_at_price && <div className="text-lg text-navy/40 line-through">{formatINR(product.compare_at_price)}</div>}
          </div>
          <p className="text-navy/70 mt-6 leading-relaxed" data-testid="product-description">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <div className="overline text-navy mb-3">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={()=>setSize(s)} className={`w-12 h-12 border text-sm ${size===s ? "bg-navy text-white border-navy" : "border-navy/20 hover:border-navy"}`} data-testid={`size-${s}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <div className="overline text-navy mb-3">Color: <span className="text-navy/60 normal-case tracking-normal">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={()=>setColor(c)} className={`px-4 h-10 border text-sm ${color===c ? "bg-navy text-white border-navy" : "border-navy/20 hover:border-navy"}`} data-testid={`color-${c}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="overline text-navy mb-3">Quantity</div>
            <div className="flex items-center border border-navy/20 w-max">
              <button onClick={()=>setQty(Math.max(1, qty-1))} className="w-10 h-10">−</button>
              <span className="w-12 text-center" data-testid="qty-display">{qty}</span>
              <button onClick={()=>setQty(qty+1)} className="w-10 h-10">+</button>
            </div>
          </div>

          <div className="text-sm mt-6" data-testid="stock-status">
            {outOfStock ? <span className="text-red-600">Out of stock</span> : <span className="text-green-700">In stock · {product.stock} available</span>}
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleAdd} disabled={outOfStock} className="btn-primary flex-1" data-testid="add-to-cart-btn">
              {outOfStock ? "Sold Out" : "Add to Cart"}
            </button>
            <button onClick={() => toggle(product)} className={`w-14 h-[54px] border flex items-center justify-center ${has(product.slug) ? "border-gold text-gold" : "border-navy text-navy hover:border-gold hover:text-gold"}`} data-testid="wishlist-btn-detail">
              <Heart size={20} strokeWidth={1.5} fill={has(product.slug) ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-navy/10">
            <div className="text-center"><Truck size={20} className="mx-auto text-gold mb-2" strokeWidth={1.5} /><div className="text-[11px] tracking-widest uppercase text-navy/70">Free Ship ₹999+</div></div>
            <div className="text-center"><RotateCcw size={20} className="mx-auto text-gold mb-2" strokeWidth={1.5} /><div className="text-[11px] tracking-widest uppercase text-navy/70">7-Day Return</div></div>
            <div className="text-center"><ShieldCheck size={20} className="mx-auto text-gold mb-2" strokeWidth={1.5} /><div className="text-[11px] tracking-widest uppercase text-navy/70">Secure Pay</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
