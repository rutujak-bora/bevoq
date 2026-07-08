import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Layers, ShoppingCart, Users, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/collections", icon: Layers, label: "Collections" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/payments", icon: CreditCard, label: "Payments" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-cream flex" data-testid="admin-layout">
      <aside className="w-64 bg-navy text-white flex flex-col">
        <Link to="/admin" className="p-6 border-b border-white/10">
          <div className="font-serif text-2xl">BEVOQ<span className="text-gold">.</span></div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/60 mt-1">Admin Console</div>
        </Link>
        <nav className="flex-1 py-4">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              data-testid={`admin-nav-${l.label.toLowerCase()}`}
              className={({isActive}) => `flex items-center gap-3 px-6 py-3 text-sm border-l-2 ${isActive ? "bg-white/5 border-gold text-gold" : "border-transparent text-white/70 hover:text-white"}`}
            >
              <l.icon size={16} strokeWidth={1.5} />{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10 text-xs text-white/60">
          <div>{user?.email}</div>
          <button onClick={async ()=>{await logout(); nav("/admin/login");}} className="flex items-center gap-2 mt-3 text-white hover:text-gold" data-testid="admin-logout"><LogOut size={14}/>Logout</button>
          <Link to="/" className="block mt-2 text-navy/50 hover:text-gold text-white/70">← Back to Store</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto">{children}</main>
    </div>
  );
}
