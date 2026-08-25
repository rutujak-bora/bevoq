import React from "react";
import { MessageCircle, Phone, Instagram, Mail, MapPin } from "lucide-react";

export default function About() {
  return (
    <div>
      <section className="bg-navy py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <p className="overline text-gold">Our Story</p>
            <h1 className="serif-display text-5xl md:text-7xl mt-4 leading-[0.95]">The Art of<br/><em className="text-gold not-italic">Everyday Luxury.</em></h1>
            <p className="text-white/70 mt-6 max-w-md">A signature. A promise. A way of dressing.</p>
          </div>
          <div className="aspect-[3/4] overflow-hidden max-w-md mx-auto md:ml-auto shadow-2xl rounded-lg">
            <img
              src="/bevoq-logo.jpg"
              alt="BEVOQ brand identity"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 py-20 text-navy leading-relaxed space-y-6">
        <p className="text-2xl font-serif text-navy">BEVOQ was born from a simple belief — that every day deserves something beautiful.</p>
        <p>We craft considered wardrobe pieces from the finest materials — Peruvian pima cotton, Italian wool, French silk — with a small atelier of makers who share our obsession for detail.</p>
        <p>Each piece is designed to be timeless, versatile, and quietly luxurious. Not fast fashion. Not seasonal noise. Just clothes you'll reach for, again and again.</p>
        <p>Welcome to the circle.</p>

        {/* Contact & Connect */}
        <div className="mt-12 pt-10 border-t border-navy/15">
          <h3 className="font-serif text-2xl text-navy mb-6">Get in Touch</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <a
              href="https://wa.me/919604508513?text=Hi%20BEVOQ,%20I'd%20like%20to%20know%20more%20about%20your%20brand"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white border border-navy/10 rounded-xl flex items-center gap-4 hover:border-gold transition-colors shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-navy/50 font-semibold">WhatsApp Us</div>
                <div className="font-bold text-navy">+91 96045 08513</div>
              </div>
            </a>

            <a
              href="https://www.instagram.com/bevoqstore?igsi=MXZqaHloNGFkZnl4NQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white border border-navy/10 rounded-xl flex items-center gap-4 hover:border-gold transition-colors shadow-sm"
            >
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center shrink-0">
                <Instagram size={24} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-navy/50 font-semibold">Follow Instagram</div>
                <div className="font-bold text-navy">@bevoqstore</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
