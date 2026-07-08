import React from "react";
export default function About() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/50" />
        <div className="relative max-w-[1200px] mx-auto px-6 h-full flex items-end pb-20">
          <div className="text-white">
            <p className="overline text-gold">Our Story</p>
            <h1 className="serif-display text-5xl md:text-7xl mt-3">The Art of<br/><em className="text-gold not-italic">Everyday Luxury.</em></h1>
          </div>
        </div>
      </section>
      <section className="max-w-[900px] mx-auto px-6 py-20 text-navy leading-relaxed space-y-6">
        <p className="text-2xl font-serif">BEVOQ was born from a simple belief — that every day deserves something beautiful.</p>
        <p>We craft considered wardrobe pieces from the finest materials — Peruvian pima cotton, Italian wool, French silk — with a small atelier of makers who share our obsession for detail.</p>
        <p>Each piece is designed to be timeless, versatile, and quietly luxurious. Not fast fashion. Not seasonal noise. Just clothes you'll reach for, again and again.</p>
        <p>Welcome to the circle.</p>
      </section>
    </div>
  );
}
