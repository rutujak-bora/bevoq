import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/storefront/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const SIZES = ["XS","S","M","L","XL"];
const COLORS = ["Black","White","Navy","Beige","Champagne","Ivory","Rose","Camel","Cream"];

export default function Products({ mode }) {
  // mode: null | trending | best-selling
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const collectionSlug = params.get("collection") || "";
  const size = params.get("size") || "";
  const color = params.get("color") || "";
  const sort = params.get("sort") || "newest";

  useEffect(() => { api.get("/collections").then(r=>setCollections(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category) q.set("category", category);
    if (collectionSlug) q.set("collection", collectionSlug);
    if (size) q.set("size", size);
    if (color) q.set("color", color);
    if (sort) q.set("sort", sort);
    q.set("min_price", String(priceRange[0]));
    q.set("max_price", String(priceRange[1]));
    if (mode === "trending") q.set("trending", "true");
    if (mode === "best-selling") q.set("best_selling", "true");
    api.get(`/products?${q.toString()}`).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [search, category, collectionSlug, size, color, sort, priceRange, mode]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };

  const title = mode === "trending" ? "Trending Now" : mode === "best-selling" ? "Best Selling" : (search ? `Search: "${search}"` : "All Products");

  const categories = useMemo(() => Array.from(new Set(collections.map(c => c.title))), [collections]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16" data-testid="products-page">
      <div className="mb-12">
        <p className="overline text-gold">Shop</p>
        <h1 className="serif-display text-5xl md:text-6xl mt-3 text-navy">{title}</h1>
        <p className="text-navy/60 mt-3">{products.length} pieces</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-10">
        {/* Filters */}
        <aside className="space-y-8" data-testid="filters-panel">
          <div>
            <div className="overline text-navy mb-4">Sort</div>
            <Select value={sort} onValueChange={v => setParam("sort", v)}>
              <SelectTrigger className="rounded-none border-navy/20" data-testid="sort-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="name_asc">Name: A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="overline text-navy mb-4">Category</div>
            <div className="space-y-2 text-sm">
              <button onClick={() => setParam("category", "")} className={`block w-full text-left ${!category ? "text-gold" : "text-navy/70 hover:text-navy"}`}>All</button>
              {categories.map(c => (
                <button key={c} onClick={() => setParam("category", c === category ? "" : c)} className={`block w-full text-left ${category===c ? "text-gold" : "text-navy/70 hover:text-navy"}`} data-testid={`filter-cat-${c.toLowerCase()}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="overline text-navy mb-4">Size</div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => setParam("size", s === size ? "" : s)} className={`w-10 h-10 border text-xs ${size===s ? "bg-navy text-white border-navy" : "border-navy/20 text-navy hover:border-navy"}`} data-testid={`filter-size-${s}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="overline text-navy mb-4">Color</div>
            <div className="space-y-2 text-sm">
              <button onClick={() => setParam("color", "")} className={`block ${!color ? "text-gold" : "text-navy/70"}`}>All</button>
              {COLORS.map(c => (
                <button key={c} onClick={() => setParam("color", c === color ? "" : c)} className={`block ${color===c ? "text-gold" : "text-navy/70 hover:text-navy"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="overline text-navy mb-4">Price</div>
            <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={10000} step={100} />
            <div className="flex justify-between text-xs text-navy/60 mt-2">
              <span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {Array.from({length: 6}).map((_,i)=><div key={i} className="aspect-[3/4] bg-cream animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-navy/60">No products found. Try adjusting filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8" data-testid="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
