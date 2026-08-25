import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, User, Menu, X, Package, ChevronDown, Copy, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const collectionCategories = [
  { 
    label: "T-Shirt", 
    to: "/collections/t-shirts", 
    description: "Baggy, Oversize, Girls & Boys, Printed Tees" 
  },
  { 
    label: "Women", 
    to: "/collections/women", 
    description: "Western Dresses, Crop Shirts, Printed Shirts" 
  },
  { 
    label: "Kurta (Men)", 
    to: "/collections/kurta", 
    description: "Exclusive Men's & Boys Traditional Festive Wear" 
  },
];

export default function Header() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCollectionActive = location.pathname.startsWith("/collections/");

  const copyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    toast.success("Coupon code 'WELCOME10' copied! Get 10% off at checkout.");
    setTimeout(() => setCopied(false), 3000);
  };

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <>
      {/* Dynamic Announcement Bar */}
      <div className="bg-navy text-white text-[11px] py-2 px-4 border-b border-gold/20" data-testid="announcement-bar">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 mx-auto md:mx-0">
            <span className="inline-flex items-center gap-1 text-gold font-semibold uppercase tracking-widest text-[10px]">
              <Sparkles size={12} /> Special Offer
            </span>
            <span className="text-white/80 hidden sm:inline">|</span>
            <span className="tracking-wider">FREE Shipping on orders above ₹999</span>
          </div>

          <div className="flex items-center justify-center gap-3 mx-auto md:mx-0">
            <span className="text-white/90">
              Use code <strong className="text-gold font-mono tracking-wider bg-black/30 px-1.5 py-0.5 rounded border border-gold/30">WELCOME10</strong> for 10% OFF
            </span>
            <button
              onClick={copyCoupon}
              className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold text-navy hover:bg-gold/90 transition-all cursor-pointer shadow-sm"
              title="Click to copy coupon"
            >
              {copied ? <Check size={11} className="text-navy" /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-black/5" data-testid="site-header">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-6">
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden" data-testid="mobile-menu-btn"><Menu size={22} strokeWidth={1.5} /></button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-cream overflow-y-auto">
              <nav className="flex flex-col gap-5 mt-8">
                <NavLink 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-xl font-serif text-navy hover:text-gold" 
                  data-testid="mobile-nav-home"
                >
                  Home
                </NavLink>

                {/* Mobile Collection Group */}
                <div className="border-y border-navy/10 py-3">
                  <button 
                    onClick={() => setMobileCollectionOpen(!mobileCollectionOpen)}
                    className="flex items-center justify-between w-full text-xl font-serif text-navy"
                  >
                    <span>Collection</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${mobileCollectionOpen ? "rotate-180 text-gold" : "text-navy/60"}`} />
                  </button>

                  {mobileCollectionOpen && (
                    <div className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-gold/40">
                      {collectionCategories.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) => `text-base ${isActive ? "text-gold font-medium" : "text-navy/80 hover:text-gold"}`}
                          data-testid={`mobile-subnav-${c.label.toLowerCase()}`}
                        >
                          <div>{c.label}</div>
                          <div className="text-[11px] text-navy/50">{c.description}</div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink 
                  to="/trending" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-xl font-serif text-navy hover:text-gold" 
                  data-testid="mobile-nav-trending"
                >
                  Trending
                </NavLink>

                <NavLink 
                  to="/best-selling" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-xl font-serif text-navy hover:text-gold" 
                  data-testid="mobile-nav-best-selling"
                >
                  Best Selling
                </NavLink>

                <NavLink 
                  to="/products" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-xl font-serif text-navy hover:text-gold" 
                  data-testid="mobile-nav-all-products"
                >
                  All Products
                </NavLink>

                <NavLink 
                  to="/bulk-custom" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-xl font-serif text-burgundy font-medium hover:text-gold" 
                  data-testid="mobile-nav-bulk-custom"
                >
                  Bulk & Custom
                </NavLink>

                <div className="border-t border-navy/10 pt-4 flex flex-col gap-4">
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">Wishlist</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">Orders</Link>
                  {!user && <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">Login / Register</Link>}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex-1 md:flex-none flex items-center gap-3 justify-center md:justify-start" data-testid="logo-link">
            <img
              src="/bevoq-logo.jpg"
              alt="BEVOQ Unisex Fashion"
              className="h-11 md:h-13 w-11 md:w-13 rounded shadow-sm object-cover"
            />
            <div className="text-left">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.18em] text-navy font-semibold leading-none">BEVOQ</h1>
              <p className="hidden md:block text-[9px] tracking-[0.28em] uppercase text-navy/70 mt-1 font-medium">Unisex Fashion · Estd 2026</p>
            </div>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            <NavLink
              to="/"
              data-testid="nav-home"
              className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
            >
              Home
            </NavLink>

            {/* Collection Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setCollectionDropdownOpen(true)}
              onMouseLeave={() => setCollectionDropdownOpen(false)}
            >
              <button
                type="button"
                className={`text-[13px] tracking-[0.15em] uppercase font-medium flex items-center gap-1.5 transition-colors ${isCollectionActive ? "text-gold" : "text-navy hover:text-gold"}`}
                data-testid="nav-collection"
              >
                Collection <ChevronDown size={14} className={`transition-transform duration-200 ${collectionDropdownOpen ? "rotate-180 text-gold" : ""}`} />
              </button>

              <div className="absolute left-0 top-full pt-2 w-72 hidden group-hover:block transition-all z-50">
                <div className="bg-white border border-black/10 shadow-2xl p-3 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/50 border-b border-black/5">
                    Brand Categories
                  </div>
                  {collectionCategories.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-3 py-2.5 rounded-sm hover:bg-cream transition-colors group/item"
                      data-testid={`dropdown-${item.label.toLowerCase()}`}
                    >
                      <div className="text-sm font-serif font-bold text-navy group-hover/item:text-burgundy flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-[10px] uppercase font-sans text-gold font-normal tracking-wider">Explore →</span>
                      </div>
                      <div className="text-xs text-navy/60 mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-black/5 pt-1.5 px-3">
                    <Link to="/products" className="text-[11px] uppercase tracking-wider text-burgundy hover:text-gold font-semibold flex items-center justify-between">
                      <span>All Collections</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <NavLink
              to="/trending"
              data-testid="nav-trending"
              className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
            >
              Trending
            </NavLink>

            <NavLink
              to="/best-selling"
              data-testid="nav-best-selling"
              className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
            >
              Best Selling
            </NavLink>

            <NavLink
              to="/products"
              data-testid="nav-all-products"
              className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
            >
              All Products
            </NavLink>

            <NavLink
              to="/bulk-custom"
              data-testid="nav-bulk-custom"
              className={({isActive}) => `text-[13px] tracking-[0.15em] uppercase font-medium gold-underline ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
            >
              Bulk & Custom
            </NavLink>
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
              {["oversized t-shirt", "baggy tee", "western dress", "crop shirt", "printed shirt", "men's kurta", "custom design"].map(t => (
                <button key={t} onClick={()=>{setQ(t); navigate(`/products?search=${t}`); setOpen(false);}} className="text-navy hover:text-gold underline underline-offset-4" data-testid={`trending-search-${t.replace(/\s/g,'-')}`}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
