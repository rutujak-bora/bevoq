import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Headphones, Instagram, Facebook, Twitter } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      toast.success("Subscribed! Use WELCOME10 for 10% off your first order.");
      setEmail("");
    } catch (err) {
      toast.error("Please check your email format.");
    } finally { setLoading(false); }
  };

  const perks = [
    { icon: Truck, title: "Free Shipping", text: "On orders above ₹999" },
    { icon: RotateCcw, title: "Easy Returns", text: "7-day return policy" },
    { icon: ShieldCheck, title: "Secure Payments", text: "100% protected checkout" },
    { icon: Headphones, title: "Support Online", text: "Chat & email 9am–9pm" },
  ];

  return (
    <footer className="bg-navy text-white mt-24">
      {/* Perks */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {perks.map(p => (
            <div key={p.title} className="flex items-start gap-3">
              <p.icon size={22} className="text-gold shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] tracking-[0.15em] uppercase font-medium">{p.title}</div>
                <div className="text-sm text-white/70 mt-1">{p.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="overline text-gold">Join the Circle</p>
            <h3 className="serif-display text-4xl md:text-5xl mt-4 leading-tight">Get 10% off your<br/>first order.</h3>
            <p className="text-white/70 mt-4 max-w-md">Subscribe for early access, private previews, and stories from the BEVOQ atelier.</p>
          </div>
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3" data-testid="newsletter-form">
            <input
              type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-white/30 px-4 py-4 text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
              data-testid="newsletter-email"
            />
            <button type="submit" disabled={loading} className="bg-gold text-navy px-8 py-4 text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-white transition-colors disabled:opacity-50" data-testid="newsletter-submit">
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-serif text-2xl text-gold">BEVOQ<span className="text-white">.</span></h4>
          <p className="text-white/60 text-sm mt-4 leading-relaxed">The Art of Everyday Luxury. Considered fashion, crafted with intention.</p>
          <div className="flex gap-4 mt-6">
            <a href="#" data-testid="social-instagram" className="text-white/70 hover:text-gold"><Instagram size={18} /></a>
            <a href="#" data-testid="social-facebook" className="text-white/70 hover:text-gold"><Facebook size={18} /></a>
            <a href="#" data-testid="social-twitter" className="text-white/70 hover:text-gold"><Twitter size={18} /></a>
          </div>
        </div>
        <div>
          <div className="overline text-white/80 mb-5">Shop</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/products" className="hover:text-gold">All Products</Link></li>
            <li><Link to="/collections/women" className="hover:text-gold">Women</Link></li>
            <li><Link to="/collections/t-shirts" className="hover:text-gold">T-Shirts</Link></li>
            <li><Link to="/collections/hoodies" className="hover:text-gold">Hoodies</Link></li>
            <li><Link to="/collections/crop-tops" className="hover:text-gold">Crop Tops</Link></li>
          </ul>
        </div>
        <div>
          <div className="overline text-white/80 mb-5">Support</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><a href="mailto:support@bevoq.com" className="hover:text-gold">support@bevoq.com</a></li>
            <li><a href="#" className="hover:text-gold">Delivery Charges</a></li>
            <li><a href="#" className="hover:text-gold">Return Policy</a></li>
            <li><a href="#" className="hover:text-gold">FAQs</a></li>
          </ul>
        </div>
        <div>
          <div className="overline text-white/80 mb-5">Account</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/login" className="hover:text-gold">Login</Link></li>
            <li><Link to="/register" className="hover:text-gold">Register</Link></li>
            <li><Link to="/orders" className="hover:text-gold">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold">Wishlist</Link></li>
            <li><Link to="/account" className="hover:text-gold">Profile</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} BEVOQ. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
