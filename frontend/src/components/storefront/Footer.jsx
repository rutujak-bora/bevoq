import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Headphones, Instagram, Facebook, Twitter, MessageCircle, Phone, Mail } from "lucide-react";
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
    { icon: Truck, title: "Free Shipping", text: "On orders above ₹999", link: "/products" },
    { icon: RotateCcw, title: "Easy Returns", text: "7-day return policy", link: "/about" },
    { icon: ShieldCheck, title: "Secure Payments", text: "100% protected checkout", link: "/products" },
    { icon: Headphones, title: "Support Online", text: "WhatsApp: +91 96045 08513", link: "https://wa.me/919604508513?text=Hi%20BEVOQ,%20I%20need%20some%20assistance" },
  ];

  return (
    <footer className="bg-navy text-white mt-24">
      {/* Perks */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {perks.map(p => (
            <a 
              key={p.title} 
              href={p.link}
              target={p.link.startsWith("http") ? "_blank" : "_self"}
              rel={p.link.startsWith("http") ? "noopener noreferrer" : ""}
              className="flex items-start gap-3 group hover:opacity-90 transition-opacity"
            >
              <p.icon size={22} className="text-gold shrink-0 mt-1 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] tracking-[0.15em] uppercase font-medium group-hover:text-gold transition-colors">{p.title}</div>
                <div className="text-sm text-white/70 mt-1">{p.text}</div>
              </div>
            </a>
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
          <div className="flex items-center gap-3">
            <img
              src="/bevoq-logo.jpg"
              alt="BEVOQ Unisex Fashion"
              className="h-10 w-10 rounded object-cover shadow"
            />
            <div>
              <h4 className="font-serif text-2xl text-white font-semibold tracking-wider">BEVOQ</h4>
              <p className="text-[9px] tracking-[0.25em] uppercase text-white/60 font-medium">Unisex Fashion · Estd 2026</p>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-4 leading-relaxed">Considered unisex fashion, crafted with intention and timeless elegance.</p>
          <div className="flex gap-4 mt-6">
            <a 
              href="https://www.instagram.com/bevoqstore?igsi=MXZqaHloNGFkZnl4NQ==" 
              target="_blank" 
              rel="noopener noreferrer" 
              data-testid="social-instagram" 
              className="text-white/70 hover:text-gold transition-colors flex items-center gap-1.5"
              aria-label="Instagram @bevoqstore"
            >
              <Instagram size={19} />
              <span className="text-xs">@bevoqstore</span>
            </a>
          </div>
        </div>
        <div>
          <div className="overline text-white/80 mb-5">Shop</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/products" className="hover:text-gold">All Products</Link></li>
            <li><Link to="/collections/t-shirts" className="hover:text-gold">T-Shirts (Baggy, Oversize, Printed)</Link></li>
            <li><Link to="/collections/women" className="hover:text-gold">Women (Western Dress, Crop & Printed Shirts)</Link></li>
            <li><Link to="/collections/kurta" className="hover:text-gold">Kurta (Men's Traditional)</Link></li>
            <li><Link to="/bulk-custom" className="hover:text-gold text-gold font-medium">Bulk & Custom Orders</Link></li>
          </ul>
        </div>
        <div>
          <div className="overline text-white/80 mb-5">Support & Help</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a 
                href="https://wa.me/919604508513?text=Hi%20BEVOQ,%20I%20have%20a%20query%20about%20an%20outfit/order" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gold flex items-center gap-2 text-white/90"
              >
                <MessageCircle size={15} className="text-[#25D366]" /> 
                <span>WhatsApp: <strong>+91 96045 08513</strong></span>
              </a>
            </li>
            <li>
              <a href="tel:+919604508513" className="hover:text-gold flex items-center gap-2 text-white/90">
                <Phone size={15} className="text-gold" />
                <span>Call: <strong>+91 96045 08513</strong></span>
              </a>
            </li>
            <li>
              <a href="mailto:support@bevoq.com" className="hover:text-gold flex items-center gap-2">
                <Mail size={15} className="text-gold/80" />
                <span>support@bevoq.com</span>
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/bevoqstore?igsi=MXZqaHloNGFkZnl4NQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gold flex items-center gap-2"
              >
                <Instagram size={15} className="text-gold/80" />
                <span>Instagram: @bevoqstore</span>
              </a>
            </li>
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
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
