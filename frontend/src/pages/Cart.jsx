import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/api";
import { Trash2, Minus, Plus } from "lucide-react";

export default function Cart() {
  const { items, update, remove, subtotal } = useCart();
  const nav = useNavigate();
  const delivery = subtotal >= 999 ? 0 : (subtotal > 0 ? 79 : 0);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16" data-testid="cart-page">
      <p className="overline text-gold">Bag</p>
      <h1 className="serif-display text-5xl mt-3 text-navy">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-navy/60">Your bag is empty.</p>
          <Link to="/products" className="btn-primary mt-6 inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 mt-12">
          <div className="divide-y divide-navy/10">
            {items.map(i => (
              <div key={i.key} className="py-6 flex gap-4" data-testid={`cart-item-${i.slug}`}>
                <div className="w-24 h-32 bg-cream shrink-0">
                  {i.image && <img src={i.image} alt={i.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <Link to={`/products/${i.slug}`} className="font-serif text-lg text-navy">{i.title}</Link>
                  <div className="text-xs text-navy/60 uppercase tracking-widest mt-1">
                    {i.size && `Size ${i.size}`}{i.size && i.color && " · "}{i.color}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-navy/20">
                      <button onClick={()=>update(i.key, i.quantity-1)} className="w-8 h-8" data-testid={`decr-${i.slug}`}><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={()=>update(i.key, i.quantity+1)} className="w-8 h-8" data-testid={`incr-${i.slug}`}><Plus size={14} /></button>
                    </div>
                    <button onClick={()=>remove(i.key)} className="text-navy/50 hover:text-navy" data-testid={`remove-${i.slug}`}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-navy font-medium">{formatINR(i.price * i.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cream p-8 h-max sticky top-32" data-testid="cart-summary">
            <div className="overline text-navy mb-6">Order Summary</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-navy/70">Subtotal</span><span data-testid="subtotal">{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-navy/70">Delivery</span><span>{delivery === 0 ? "FREE" : formatINR(delivery)}</span></div>
              <div className="border-t border-navy/10 my-3" />
              <div className="flex justify-between text-lg font-medium"><span>Total</span><span data-testid="cart-total">{formatINR(subtotal + delivery)}</span></div>
            </div>
            <button onClick={()=>nav("/checkout")} className="btn-primary w-full mt-6" data-testid="checkout-btn">Checkout</button>
            <Link to="/products" className="block text-center mt-4 text-xs uppercase tracking-widest text-navy/70">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
