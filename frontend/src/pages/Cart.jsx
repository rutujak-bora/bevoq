import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/api";
import { Trash2, Minus, Plus, Truck, Sparkles, ShieldCheck, RotateCcw, Tag } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { items, update, remove, subtotal } = useCart();
  const nav = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const delivery = subtotal >= 999 ? 0 : (subtotal > 0 ? 79 : 0);
  const freeShipThreshold = 999;
  const progress = Math.min(100, Math.round((subtotal / freeShipThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subtotal);

  const applyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "WELCOME10") {
      setAppliedCoupon("WELCOME10");
      toast.success("Coupon 'WELCOME10' applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code. Try WELCOME10");
    }
  };

  const discount = appliedCoupon === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16" data-testid="cart-page">
      <p className="overline text-gold">Bag</p>
      <h1 className="serif-display text-4xl md:text-5xl mt-3 text-navy">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center py-16 bg-white border border-navy/10 rounded-xl">
          <Truck size={48} className="mx-auto text-navy/30 mb-4" strokeWidth={1} />
          <p className="font-serif text-2xl text-navy">Your shopping bag is empty.</p>
          <p className="text-sm text-navy/60 mt-2 max-w-sm mx-auto">Explore our collection of unisex oversized tees, western dresses, and traditional kurtas.</p>
          <Link to="/products" className="btn-primary mt-6 inline-block py-3 px-8 text-xs uppercase tracking-widest shadow-lg">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 mt-8">
          <div>
            {/* Free Shipping Progress Banner */}
            <div className="bg-white border border-navy/15 rounded-xl p-5 mb-8 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-navy font-semibold mb-2">
                <Truck size={18} className="text-gold" />
                {subtotal >= freeShipThreshold ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <Sparkles size={15} /> Congratulations! You have unlocked FREE Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatINR(remainingForFreeShip)}</strong> more to get <strong className="text-gold">FREE Delivery</strong>!
                  </span>
                )}
              </div>
              <div className="w-full h-2.5 bg-navy/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${subtotal >= freeShipThreshold ? "bg-emerald-600" : "bg-gold"}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-white border border-navy/10 rounded-xl divide-y divide-navy/10 overflow-hidden shadow-sm">
              {items.map(i => (
                <div key={i.key} className="p-6 flex gap-5 hover:bg-navy/[0.01] transition-colors" data-testid={`cart-item-${i.slug}`}>
                  <div className="w-24 h-32 bg-[#F0EDE4] shrink-0 rounded overflow-hidden">
                    {i.image ? (
                      <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy/30 font-serif text-xl">BEVOQ</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <Link to={`/products/${i.slug}`} className="font-serif text-lg text-navy hover:text-gold transition-colors leading-snug">
                          {i.title}
                        </Link>
                        <div className="text-navy font-semibold text-base shrink-0">
                          {formatINR(i.price * i.quantity)}
                        </div>
                      </div>
                      <div className="text-xs text-navy/60 uppercase tracking-wider mt-1.5 flex flex-wrap gap-2">
                        {i.size && <span className="bg-navy/5 px-2 py-0.5 rounded font-medium">Size: {i.size}</span>}
                        {i.color && <span className="bg-navy/5 px-2 py-0.5 rounded font-medium">Color: {i.color}</span>}
                      </div>
                      <div className="text-xs text-navy/50 mt-1">Price per unit: {formatINR(i.price)}</div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-navy/20 rounded bg-white">
                        <button onClick={()=>update(i.key, i.quantity-1)} className="w-8 h-8 flex items-center justify-center hover:bg-navy/5 font-bold" data-testid={`decr-${i.slug}`} aria-label="Decrease quantity"><Minus size={13} /></button>
                        <span className="w-8 text-center text-xs font-semibold">{i.quantity}</span>
                        <button onClick={()=>update(i.key, i.quantity+1)} className="w-8 h-8 flex items-center justify-center hover:bg-navy/5 font-bold" data-testid={`incr-${i.slug}`} aria-label="Increase quantity"><Plus size={13} /></button>
                      </div>
                      <button 
                        onClick={()=>remove(i.key)} 
                        className="inline-flex items-center gap-1 text-xs text-red-600/70 hover:text-red-700 font-medium py-1 px-2 rounded hover:bg-red-50" 
                        data-testid={`remove-${i.slug}`}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-navy/15 p-6 rounded-xl shadow-sm sticky top-28" data-testid="cart-summary">
              <div className="overline text-navy mb-5 pb-3 border-b border-navy/10 font-bold">Order Summary</div>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-navy/70">
                  <span>Bag Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="text-navy font-semibold" data-testid="subtotal">{formatINR(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-navy/70">
                  <span>Delivery Charges</span>
                  <span className={delivery === 0 ? "text-emerald-700 font-bold" : "text-navy"}>
                    {delivery === 0 ? "FREE" : formatINR(delivery)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded">
                    <span className="flex items-center gap-1"><Tag size={13} /> Promo (WELCOME10)</span>
                    <span>−{formatINR(discount)}</span>
                  </div>
                )}

                <div className="border-t border-navy/10 my-3 pt-3" />

                <div className="flex justify-between text-xl font-serif text-navy">
                  <span>Total Amount</span>
                  <span className="font-bold" data-testid="cart-total">{formatINR(total)}</span>
                </div>
                <p className="text-[11px] text-navy/50 text-right">Includes all taxes & duties</p>
              </div>

              {/* Coupon Form */}
              <form onSubmit={applyCoupon} className="mt-6 pt-5 border-t border-navy/10">
                <label className="block text-xs font-semibold text-navy mb-2 flex items-center justify-between">
                  <span>Have a Promo Code?</span>
                  <button type="button" onClick={() => { setCoupon("WELCOME10"); }} className="text-gold hover:underline text-[11px]">Apply WELCOME10</button>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-navy/20 px-3 py-2 text-xs uppercase font-mono rounded focus:outline-none focus:border-navy"
                  />
                  <button type="submit" className="px-3.5 py-2 bg-navy text-white text-xs uppercase font-semibold rounded hover:bg-navy/90">
                    Apply
                  </button>
                </div>
              </form>

              <button 
                onClick={()=>nav("/checkout")} 
                className="btn-primary w-full mt-6 py-3.5 text-xs uppercase tracking-widest font-bold shadow-xl" 
                data-testid="checkout-btn"
              >
                Proceed to Checkout • {formatINR(total)}
              </button>

              <Link to="/products" className="block text-center mt-4 text-xs uppercase tracking-widest text-navy/60 hover:text-navy font-medium">
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="p-4 bg-navy/5 rounded-xl border border-navy/10 space-y-2.5 text-xs text-navy/80">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={16} className="text-gold" />
                <span>100% Safe & Encrypted Payments</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <RotateCcw size={16} className="text-gold" />
                <span>7 Days Hassle-Free Exchange / Return</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Truck size={16} className="text-gold" />
                <span>Fast Express Dispatch within 24 Hours</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
