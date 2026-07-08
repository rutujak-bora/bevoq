import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { formatINR } from "@/lib/api";

const STATUS_COLORS = {
  placed: "text-navy",
  processing: "text-gold",
  shipped: "text-blue-600",
  delivered: "text-green-700",
  cancelled: "text-red-600",
  refunded: "text-orange-600",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders").then(r=>setOrders(r.data)); }, []);
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16" data-testid="orders-page">
      <p className="overline text-gold">Track</p>
      <h1 className="serif-display text-5xl mt-3 text-navy">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-navy/60 mt-8">No orders yet. <Link to="/products" className="text-gold underline">Start shopping</Link></p>
      ) : (
        <div className="mt-10 space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border border-navy/10 p-6 bg-white" data-testid={`order-${o.order_no}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-serif text-xl text-navy">{o.order_no}</div>
                  <div className="text-xs text-navy/60 uppercase tracking-widest">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} items</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className={`text-sm uppercase tracking-widest ${STATUS_COLORS[o.status] || "text-navy"}`}>{o.status}</div>
                  <div className="text-navy font-medium">{formatINR(o.total)}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 overflow-auto">
                {o.items.slice(0,4).map((i, idx) => i.image && <img key={idx} src={i.image} alt="" className="w-16 h-20 object-cover" />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
