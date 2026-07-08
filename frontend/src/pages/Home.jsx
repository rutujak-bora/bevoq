import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/storefront/ProductCard";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=8").then(r => setProducts(r.data)).catch(()=>{});
    api.get("/products?trending=true&limit=4").then(r => setTrending(r.data)).catch(()=>{});
    api.get("/collections").then(r => setCollections(r.data)).catch(()=>{});
  }, []);

  const topCollections = collections.filter(c => ["women","t-shirts","hoodies","crop-tops"].includes(c.slug));

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden" data-testid="hero-section">
        <img src="https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?w=1920&q=85" alt="BEVOQ campaign" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-10 flex items-end pb-24">
          <div className="text-white max-w-2xl fade-up">
            <p className="overline text-gold mb-6">Season 01 · Everyday Luxury</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] font-light">The Art of<br/><em className="text-gold not-italic">Everyday</em> Luxury.</h1>
            <p className="mt-6 text-white/80 text-lg max-w-md">Considered fashion for the modern wardrobe. Discover the new season, shaped by craft.</p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/products" className="btn-primary bg-gold border-gold text-navy hover:bg-white hover:border-white" data-testid="hero-shop-btn">Shop Collection</Link>
              <Link to="/collections/women" className="btn-outline border-white text-white hover:bg-white hover:text-navy" data-testid="hero-explore-btn">Explore Women</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Collections Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28" data-testid="top-collections">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="overline text-gold">Curated</p>
            <h2 className="serif-display text-4xl md:text-5xl mt-3 text-navy">Top Collections</h2>
          </div>
          <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-navy text-sm uppercase tracking-[0.15em]">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {topCollections.length ? topCollections.map((c, i) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className={`group relative overflow-hidden ${i===0 ? "md:col-span-2 md:row-span-2 aspect-[3/4] md:aspect-auto md:h-[720px]" : "aspect-[3/4]"}`} data-testid={`collection-tile-${c.slug}`}>
              <img src={c.banner_image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"} alt={c.title} className="w-full h-full object-cover product-img" />
              <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors" />
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="text-white">
                  <div className="overline text-gold mb-2">Shop</div>
                  <div className="font-serif text-3xl md:text-4xl">{c.title}</div>
                </div>
              </div>
            </Link>
          )) : Array.from({length: 4}).map((_,i) => <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20" data-testid="featured-products">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="overline text-gold">Handpicked</p>
            <h2 className="serif-display text-4xl md:text-5xl mt-3 text-navy">Featured Pieces</h2>
          </div>
          <Link to="/products" className="text-navy text-sm uppercase tracking-[0.15em]">Shop All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-navy text-white py-24" data-testid="editorial-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="overline text-gold">Our Philosophy</p>
            <h2 className="serif-display text-5xl md:text-6xl mt-4 leading-[1.05]">Luxury,<br/>reimagined for<br/><em className="text-gold not-italic">every day</em>.</h2>
            <p className="text-white/70 mt-6 leading-relaxed max-w-md">BEVOQ was built on a simple idea: everyday can be extraordinary. Our pieces are crafted from the finest materials, designed to be worn — and loved — again and again.</p>
            <Link to="/about" className="btn-outline border-gold text-gold hover:bg-gold hover:text-navy mt-8 inline-block">Our Story</Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=85" alt="Editorial" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Trending Row */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20" data-testid="trending-section">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="overline text-gold">Right Now</p>
            <h2 className="serif-display text-4xl md:text-5xl mt-3 text-navy">Trending</h2>
          </div>
          <Link to="/trending" className="text-navy text-sm uppercase tracking-[0.15em]">See All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trending.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
