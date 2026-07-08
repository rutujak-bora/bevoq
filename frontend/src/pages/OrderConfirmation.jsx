import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api, { formatINR } from "@/lib/api";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  useEffect(() => {
    if (!order) {
      api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(()=>{});
    }
  }, [id, order]);

  if (!order) return <div className="p-20 text-center text-navy/60">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20" data-testid="order-confirmation">
      <div className="text-center">
        <CheckCircle size={56} className="text-gold mx-auto" strokeWidth={1} />
        <p className="overline text-gold mt-6">Thank You</p>
        <h1 className="serif-display text-5xl mt-3 text-navy">Order Confirmed</h1>
        <p className="text-navy/60 mt-3">Order <strong className="text-navy">{order.order_no}</strong> · A confirmation has been sent to <strong>{order.email}</strong></p>
      </div>

      <div className="mt-12 border border-navy/10 p-8 bg-white">
        <div className="divide-y divide-navy/10">
          {order.items.map((i, idx) => (
            <div key={idx} className="py-4 flex gap-4">
              {i.image && <img src={i.image} alt="" className="w-16 h-20 object-cover" />}
              <div className="flex-1">
                <div className="font-serif text-navy">{i.title}</div>
                <div className="text-xs text-navy/60 uppercase tracking-widest">{i.size} {i.color && `· ${i.color}`} · Qty {i.quantity}</div>
              </div>
              <div className="text-navy">{formatINR(i.price * i.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-navy/10 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-navy/70">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-navy/70">Delivery</span><span>{order.delivery === 0 ? "FREE" : formatINR(order.delivery)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-gold"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}
          <div className="flex justify-between text-lg font-medium border-t border-navy/10 pt-2 mt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6 text-sm">
        <div className="border border-navy/10 p-6">
          <div className="overline text-navy mb-3">Shipping To</div>
          <div className="text-navy/80">{order.address.full_name}<br/>{order.address.street}<br/>{order.address.city}, {order.address.state} {order.address.pincode}<br/>{order.address.country}<br/>{order.address.phone}</div>
        </div>
        <div className="border border-navy/10 p-6">
          <div className="overline text-navy mb-3">Payment</div>
          <div className="text-navy/80">Method: <span className="uppercase">{order.payment_method}</span><br/>Status: <span className="uppercase text-gold">{order.payment_status}</span></div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    </div>
  );
}
