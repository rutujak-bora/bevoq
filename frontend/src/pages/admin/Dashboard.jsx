import React, { useEffect, useState } from "react";
import api, { formatINR } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, ShoppingCart, Users, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/dashboard/stats").then(r=>setStats(r.data)); }, []);
  if (!stats) return <AdminLayout><div className="p-10">Loading...</div></AdminLayout>;

  const cards = [
    { label: "Total Revenue", value: formatINR(stats.total_revenue), icon: TrendingUp, color: "text-gold" },
    { label: "Total Orders", value: stats.total_orders, icon: ShoppingCart, color: "text-navy" },
    { label: "Pending Orders", value: stats.pending_orders, icon: ShoppingCart, color: "text-orange-500" },
    { label: "Customers", value: stats.total_customers, icon: Users, color: "text-navy" },
    { label: "Low Stock", value: stats.low_stock_products, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-dashboard">
        <p className="overline text-gold">Overview</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {cards.map(c => (
            <div key={c.label} className="bg-white border border-navy/10 p-5" data-testid={`stat-${c.label.toLowerCase().replace(/\s/g,'-')}`}>
              <div className="flex items-center justify-between">
                <div className="overline text-navy/60">{c.label}</div>
                <c.icon size={18} className={c.color} strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-serif text-navy mt-3">{c.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white border border-navy/10 p-6">
            <div className="overline text-navy mb-4">Revenue · Last 7 Days</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.revenue_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D8" />
                <XAxis dataKey="date" stroke="#0A1A3E" fontSize={11} />
                <YAxis stroke="#0A1A3E" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#C9A961" strokeWidth={2} dot={{ fill: "#0A1A3E" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-navy/10 p-6">
            <div className="overline text-navy mb-4">Recent Customers</div>
            <div className="space-y-3">
              {stats.recent_customers.map(c => (
                <div key={c.id} className="text-sm">
                  <div className="text-navy">{c.name}</div>
                  <div className="text-xs text-navy/60">{c.email}</div>
                </div>
              ))}
              {stats.recent_customers.length === 0 && <div className="text-xs text-navy/60">No customers yet.</div>}
            </div>
          </div>
        </div>

        <div className="bg-white border border-navy/10 p-6 mt-6">
          <div className="overline text-navy mb-4">Recent Orders</div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr><th className="text-left py-2">Order</th><th className="text-left">Customer</th><th className="text-left">Status</th><th className="text-right">Total</th></tr>
            </thead>
            <tbody>
              {stats.recent_orders.map(o => (
                <tr key={o.id} className="border-b border-navy/5">
                  <td className="py-3 font-serif">{o.order_no}</td>
                  <td>{o.email}</td>
                  <td className="uppercase text-xs tracking-widest text-gold">{o.status}</td>
                  <td className="text-right">{formatINR(o.total)}</td>
                </tr>
              ))}
              {stats.recent_orders.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-navy/60">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
