import React, { useEffect, useState } from "react";
import api, { formatINR } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => { api.get("/admin/customers").then(r=>setCustomers(r.data)); }, []);
  const filtered = customers.filter(c => !q || c.email.toLowerCase().includes(q.toLowerCase()) || c.name?.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-customers">
        <p className="overline text-gold">People</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">Customers</h1>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or email" className="mt-6 w-full max-w-md border border-navy/20 px-4 py-2" />
        <div className="bg-white border border-navy/10 mt-6">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr><th className="text-left p-4">Name</th><th className="text-left">Email</th><th className="text-left">Phone</th><th className="text-left">Orders</th><th className="text-right pr-4">Total Spend</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-navy/5">
                  <td className="p-4 font-serif text-navy">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.order_count}</td>
                  <td className="text-right pr-4">{formatINR(c.total_spend)}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="text-center p-8 text-navy/60">No customers</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.get("/admin/payments").then(r=>setPayments(r.data)); }, []);
  const totalPaid = payments.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);
  const totalCod = payments.filter(p=>p.method==="cod").reduce((s,p)=>s+p.amount,0);
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-payments">
        <p className="overline text-gold">Finance</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">Payments</h1>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-navy/10 p-5"><div className="overline text-navy/60">Paid Online</div><div className="font-serif text-2xl text-navy mt-2">{formatINR(totalPaid)}</div></div>
          <div className="bg-white border border-navy/10 p-5"><div className="overline text-navy/60">COD Pending</div><div className="font-serif text-2xl text-navy mt-2">{formatINR(totalCod)}</div></div>
          <div className="bg-white border border-navy/10 p-5"><div className="overline text-navy/60">Total Records</div><div className="font-serif text-2xl text-navy mt-2">{payments.length}</div></div>
        </div>
        <div className="bg-white border border-navy/10 mt-6">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr><th className="text-left p-4">Order</th><th className="text-left">Method</th><th className="text-left">Status</th><th className="text-left">Date</th><th className="text-right pr-4">Amount</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-navy/5">
                  <td className="p-4 font-serif">{p.order_no}</td>
                  <td className="uppercase">{p.method}</td>
                  <td className="uppercase text-xs text-gold">{p.status}</td>
                  <td className="text-xs">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="text-right pr-4">{formatINR(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
