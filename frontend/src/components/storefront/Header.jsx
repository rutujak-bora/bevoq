import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, User, Menu, X, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const nav = [
  { label: "Home", to: "/" },
  { label: "Trending", to: "/trending" },
  { label: "Best Selling", to: "/best-selling" },
  { label: "All Products", to: "/products" },
  { label: "About Us", to: "/about" },
];

export default function Header() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-navy text-white text-[11px] tracking-[0.25em] uppercase py-2 text-center font-medium" data-testid="announcement-bar">
        Free Shipping on Orders Above ₹999 &nbsp;·&nbsp; Use Code <span className="text-gold">WELCOME10</span> for 10% Off
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-black/5" data-testid="site-header">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-6">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden" data-testid="mobile-menu-btn"><Menu size={22} strokeWidth={1.5} /></button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-cream">
              <nav className="flex flex-col gap-6 mt-10">
                {nav.map(n => (
                  <NavLink key={n.to} to={n.to} className="text-xl font-serif" data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s/g,'-')}`}>{n.label}</NavLink>
                ))}
                <Link to="/wishlist" className="text-xl font-serif">Wishlist</Link>
                <Link to="/orders" className="text-xl font-serif">Orders</Link>
                {!user && <Link to="/login" className="text-xl font-serif">Login / Register</Link>}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex-1 md:flex-none flex items-center gap-3 justify-center md:justify-start" data-testid="logo-link">
            <img
              src="https://customer-assets.emergentagent.com/job_threads-platform/artifacts/ktu1ka7j_WhatsApp%20Image%202026-07-08%20at%2011.36.24.jpeg"
              alt="BEVOQ"
              className="h-12 md:h-14 w-auto object-cover object-center"
              style={{ clipPath: "inset(15% 20% 15% 20%)" }}
            />
            <div className="text-left">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-navy font-medium leading-none">BEVOQ<span className="text-gold">.</span></h1>
              <p className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-navy/60 mt-1">The Art of Everyday Luxury</p>
            </div>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map(n => (
              <NavLink
                key={n.to} to={n.to}
                data-testid={`nav-${n.label.toLowerCase().replace(/\s/g,'-')}`}
                className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-5">
            <button onClick={() => setOpen(v=>!v)} data-testid="search-toggle-btn"><Search size={20} strokeWidth={1.5} className="text-navy" /></button>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-[11px] tracking-[0.2em] uppercase text-gold hidden lg:inline" data-testid="admin-link">Admin</Link>
            )}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-1" data-testid="user-menu-btn"><User size={20} strokeWidth={1.5} className="text-navy" /></button>
                <div className="absolute right-0 top-full pt-3 hidden group-hover:block">
                  <div className="bg-white border border-black/10 py-2 w-48 shadow-lg">
                    <div className="px-4 py-2 text-[11px] text-navy/60 uppercase tracking-wider">{user.email}</div>
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-cream">My Account</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-cream">Orders</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-cream" data-testid="logout-btn">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" data-testid="login-link" className="hidden md:inline"><User size={20} strokeWidth={1.5} className="text-navy" /></Link>
            )}
            <Link to="/wishlist" className="relative" data-testid="wishlist-link">
              <Heart size={20} strokeWidth={1.5} className="text-navy" />
              {slugs.length > 0 && <span className="absolute -top-2 -right-2 bg-gold text-navy text-[10px] w-4 h-4 flex items-center justify-center font-medium">{slugs.length}</span>}
            </Link>
            <Link to="/orders" className="hidden md:inline" data-testid="orders-link"><Package size={20} strokeWidth={1.5} className="text-navy" /></Link>
            <Link to="/cart" className="relative" data-testid="cart-link">
              <ShoppingBag size={20} strokeWidth={1.5} className="text-navy" />
              {count > 0 && <span className="absolute -top-2 -right-2 bg-navy text-white text-[10px] w-4 h-4 flex items-center justify-center" data-testid="cart-count">{count}</span>}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {open && (
          <div className="border-t border-black/10 bg-white" data-testid="search-panel">
            <form onSubmit={submit} className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex items-center gap-4">
              <Search size={20} className="text-navy" />
              <Input
                autoFocus value={q} onChange={e=>setQ(e.target.value)}
                placeholder="Search for t-shirts, dresses, hoodies..."
                className="flex-1 border-0 border-b border-navy/20 rounded-none focus-visible:ring-0 text-base"
                data-testid="search-input"
              />
              <button type="button" onClick={()=>setOpen(false)}><X size={20} className="text-navy" /></button>
            </form>
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-6 flex flex-wrap gap-2 text-sm">
              <span className="text-navy/60 uppercase tracking-wider text-[11px]">Trending:</span>
              {["t-shirt", "dress", "crop top", "hoodie"].map(t => (
                <button key={t} onClick={()=>{setQ(t); navigate(`/products?search=${t}`); setOpen(false);}} className="text-navy hover:text-gold underline underline-offset-4" data-testid={`trending-search-${t.replace(/\s/g,'-')}`}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
