import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api, { formatINR, formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    payment_method: "cod",
    coupon_code: "",
  });

  const delivery = subtotal >= 999 ? 0 : 79;
  const discount = form.coupon_code.toUpperCase() === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  const change = (k, v) => setForm(f => ({...f, [k]: v}));

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, size: i.size, color: i.color })),
        address: {
          label: "Shipping",
          full_name: form.full_name, phone: form.phone,
          street: form.street, city: form.city, state: form.state,
          pincode: form.pincode, country: form.country,
        },
        payment_method: form.payment_method,
        coupon_code: form.coupon_code || null,
        email: form.email,
      };
      const { data } = await api.post("/checkout", payload);
      clear();
      toast.success("Order placed successfully!");
      nav(`/order-confirmation/${data.id}`, { state: { order: data } });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return <div className="max-w-4xl mx-auto p-20 text-center text-navy/60">Your cart is empty. <a href="/products" className="text-gold">Shop now</a></div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16" data-testid="checkout-page">
      <p className="overline text-gold">Checkout</p>
      <h1 className="serif-display text-5xl mt-3 text-navy">Complete Your Order</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_400px] gap-12 mt-12">
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-6">Contact</h2>
            <input required type="email" value={form.email} onChange={e=>change("email", e.target.value)} placeholder="Email" className="w-full border border-navy/20 px-4 py-3" data-testid="checkout-email" />
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-6">Shipping Address</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input required value={form.full_name} onChange={e=>change("full_name", e.target.value)} placeholder="Full Name" className="border border-navy/20 px-4 py-3" data-testid="checkout-name" />
              <input required value={form.phone} onChange={e=>change("phone", e.target.value)} placeholder="Phone" className="border border-navy/20 px-4 py-3" data-testid="checkout-phone" />
              <input required value={form.street} onChange={e=>change("street", e.target.value)} placeholder="Street Address" className="md:col-span-2 border border-navy/20 px-4 py-3" data-testid="checkout-street" />
              <input required value={form.city} onChange={e=>change("city", e.target.value)} placeholder="City" className="border border-navy/20 px-4 py-3" data-testid="checkout-city" />
              <input required value={form.state} onChange={e=>change("state", e.target.value)} placeholder="State" className="border border-navy/20 px-4 py-3" data-testid="checkout-state" />
              <input required value={form.pincode} onChange={e=>change("pincode", e.target.value)} placeholder="Pincode" className="border border-navy/20 px-4 py-3" data-testid="checkout-pincode" />
              <input required value={form.country} onChange={e=>change("country", e.target.value)} placeholder="Country" className="border border-navy/20 px-4 py-3" />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-6">Payment Method</h2>
            <div className="space-y-3">
              {[
                {id: "cod", label: "Cash on Delivery"},
                {id: "upi", label: "UPI / GPay / Paytm"},
                {id: "card", label: "Credit / Debit Card"},
                {id: "razorpay", label: "Razorpay (mocked)"},
              ].map(p => (
                <label key={p.id} className={`flex items-center gap-3 border p-4 cursor-pointer ${form.payment_method===p.id ? "border-navy" : "border-navy/20"}`}>
                  <input type="radio" name="pm" value={p.id} checked={form.payment_method===p.id} onChange={e=>change("payment_method", e.target.value)} data-testid={`pm-${p.id}`} />
                  <span className="text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-cream p-8 h-max sticky top-32">
          <div className="overline text-navy mb-4">Summary</div>
          <div className="space-y-3 text-sm max-h-60 overflow-auto">
            {items.map(i => (
              <div key={i.key} className="flex justify-between">
                <span className="text-navy/70">{i.title} × {i.quantity}</span>
                <span>{formatINR(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-navy/10 my-4" />
          <div className="flex gap-2 mb-4">
            <input placeholder="Coupon" value={form.coupon_code} onChange={e=>change("coupon_code", e.target.value)} className="flex-1 border border-navy/20 px-3 py-2 text-sm" data-testid="coupon-input" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "FREE" : formatINR(delivery)}</span></div>
            {discount > 0 && <div className="flex justify-between text-gold"><span>Discount</span><span>−{formatINR(discount)}</span></div>}
            <div className="border-t border-navy/10 my-2" />
            <div className="flex justify-between text-lg font-medium"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6" data-testid="place-order-btn">
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
