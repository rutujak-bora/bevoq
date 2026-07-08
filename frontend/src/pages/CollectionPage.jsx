import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/storefront/ProductCard";

export default function CollectionPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/collections/${slug}`).then(r => setData(r.data)); }, [slug]);
  if (!data) return <div className="p-20 text-center text-navy/60">Loading...</div>;
  const { collection, products } = data;
  return (
    <div>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-navy">
        {collection.banner_image && <img src={collection.banner_image} alt={collection.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-end pb-16">
          <div className="text-white">
            <p className="overline text-gold">Collection</p>
            <h1 className="serif-display text-5xl md:text-6xl mt-3">{collection.title}</h1>
            <p className="max-w-lg mt-4 text-white/80">{collection.description}</p>
          </div>
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
