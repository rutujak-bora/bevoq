import React from "react";
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
          <div className="aspect-[3/4] overflow-hidden max-w-md mx-auto md:ml-auto shadow-2xl">
            <img
              src="https://customer-assets.emergentagent.com/job_threads-platform/artifacts/ktu1ka7j_WhatsApp%20Image%202026-07-08%20at%2011.36.24.jpeg"
              alt="BEVOQ brand identity"
              className="w-full h-full object-cover"
            />
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
