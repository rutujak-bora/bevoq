import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { formatINR } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const load = () => api.get(`/admin/orders${status ? `?status=${status}` : ""}`).then(r=>setOrders(r.data));
  useEffect(() => { load(); }, [status]);
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-orders">
        <p className="overline text-gold">Fulfilment</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">Orders</h1>
        <div className="mt-6 flex gap-2 flex-wrap">
          <button onClick={()=>setStatus("")} className={`px-4 py-2 text-xs uppercase tracking-widest ${!status ? "bg-navy text-white" : "border border-navy/20"}`}>All</button>
          {STATUSES.map(s => (
            <button key={s} onClick={()=>setStatus(s)} className={`px-4 py-2 text-xs uppercase tracking-widest ${status===s ? "bg-navy text-white" : "border border-navy/20"}`}>{s}</button>
          ))}
        </div>
        <div className="bg-white border border-navy/10 mt-6">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr><th className="text-left p-4">Order</th><th className="text-left">Email</th><th className="text-left">Date</th><th className="text-left">Status</th><th className="text-left">Payment</th><th className="text-right pr-4">Total</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-navy/5 hover:bg-cream cursor-pointer">
                  <td className="p-4 font-serif"><Link to={`/admin/orders/${o.id}`} className="text-navy hover:text-gold">{o.order_no}</Link></td>
                  <td>{o.email}</td>
                  <td className="text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="uppercase text-xs text-gold">{o.status}</td>
                  <td className="uppercase text-xs">{o.payment_status}</td>
                  <td className="text-right pr-4">{formatINR(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="text-center p-8 text-navy/60">No orders</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const load = () => api.get(`/orders/${id}`).then(r=>setOrder(r.data));
  useEffect(() => { load(); }, [id]);
  const update = async (status) => {
    try { await api.put(`/admin/orders/${id}/status`, { status }); toast.success("Status updated"); load(); }
    catch { toast.error("Failed"); }
  };
  const invoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Invoice ${order.order_no}</title><style>body{font-family:Georgia,serif;padding:40px;color:#0A1A3E}h1{color:#C9A961}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}</style></head><body>
      <h1>BEVOQ</h1><h2>Invoice ${order.order_no}</h2>
      <p>${new Date(order.created_at).toLocaleString()}</p>
      <p><strong>Bill To:</strong><br/>${order.address.full_name}<br/>${order.address.street}<br/>${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>${order.email}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
      ${order.items.map(i=>`<tr><td>${i.title} ${i.size||''} ${i.color||''}</td><td>${i.quantity}</td><td>₹${i.price}</td><td>₹${i.price*i.quantity}</td></tr>`).join('')}
      </tbody></table>
      <p style="text-align:right;margin-top:20px">Subtotal: ₹${order.subtotal}<br/>Delivery: ₹${order.delivery}<br/>Discount: −₹${order.discount}<br/><strong>Total: ₹${order.total}</strong></p>
      <p>Payment: ${order.payment_method} · ${order.payment_status}</p>
      <script>window.print()</script></body></html>`);
  };
  if (!order) return <AdminLayout><div className="p-10">Loading...</div></AdminLayout>;
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-order-detail">
        <div className="flex justify-between items-start">
          <div>
            <p className="overline text-gold">Order</p>
            <h1 className="serif-display text-4xl mt-2 text-navy">{order.order_no}</h1>
            <p className="text-navy/60 text-sm mt-2">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <button onClick={invoice} className="btn-outline" data-testid="download-invoice-btn">Download Invoice</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white border border-navy/10 p-6">
            <div className="overline text-navy mb-4">Items</div>
            <div className="divide-y divide-navy/10">
              {order.items.map((i, idx) => (
                <div key={idx} className="py-4 flex gap-4">
                  {i.image && <img src={i.image} alt="" className="w-16 h-20 object-cover" />}
                  <div className="flex-1">
                    <div className="font-serif text-navy">{i.title}</div>
                    <div className="text-xs text-navy/60 uppercase tracking-widest">{i.size} {i.color && `· ${i.color}`} · Qty {i.quantity}</div>
                  </div>
                  <div>{formatINR(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy/10 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatINR(order.delivery)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}
              <div className="flex justify-between font-medium text-lg border-t border-navy/10 pt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-navy/10 p-5">
              <div className="overline text-navy mb-3">Status</div>
              <div className="uppercase text-lg text-gold">{order.status}</div>
              <div className="mt-4 space-y-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={()=>update(s)} disabled={s===order.status} className={`w-full text-left px-3 py-2 text-xs uppercase tracking-widest ${s===order.status ? "bg-navy text-white" : "border border-navy/20 hover:bg-navy hover:text-white"}`} data-testid={`status-${s}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="bg-white border border-navy/10 p-5 text-sm">
              <div className="overline text-navy mb-3">Customer</div>
              <div>{order.email}</div>
              <div className="mt-4 text-navy/80">{order.address.full_name}<br/>{order.address.street}<br/>{order.address.city}, {order.address.state} {order.address.pincode}<br/>{order.address.phone}</div>
            </div>
            <div className="bg-white border border-navy/10 p-5 text-sm">
              <div className="overline text-navy mb-3">Payment</div>
              <div className="uppercase">{order.payment_method}</div>
              <div className="uppercase text-gold mt-1">{order.payment_status}</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
