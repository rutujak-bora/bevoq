import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { formatINR } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  Heart, Truck, RotateCcw, ShieldCheck, Star, Ruler, 
  MapPin, CheckCircle2, AlertCircle, ChevronRight, Sparkles, X, 
  Share2, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

// Size charts by category
const SIZE_CHARTS = {
  "T-Shirts": {
    inches: [
      { size: "XS", chest: "36", length: "27", shoulder: "17" },
      { size: "S", chest: "38", length: "28", shoulder: "18" },
      { size: "M", chest: "40", length: "29", shoulder: "19" },
      { size: "L", chest: "42", length: "30", shoulder: "20" },
      { size: "XL", chest: "44", length: "31", shoulder: "21" },
    ],
    cm: [
      { size: "XS", chest: "91", length: "68", shoulder: "43" },
      { size: "S", chest: "96", length: "71", shoulder: "46" },
      { size: "M", chest: "102", length: "74", shoulder: "48" },
      { size: "L", chest: "107", length: "76", shoulder: "51" },
      { size: "XL", chest: "112", length: "79", shoulder: "53" },
    ]
  },
  "Women": {
    inches: [
      { size: "XS", bust: "32", waist: "26", hips: "35", length: "42" },
      { size: "S", bust: "34", waist: "28", hips: "37", length: "43" },
      { size: "M", bust: "36", waist: "30", hips: "39", length: "44" },
      { size: "L", bust: "38", waist: "32", hips: "41", length: "45" },
    ],
    cm: [
      { size: "XS", bust: "81", waist: "66", hips: "89", length: "106" },
      { size: "S", bust: "86", waist: "71", hips: "94", length: "109" },
      { size: "M", bust: "91", waist: "76", hips: "99", length: "112" },
      { size: "L", bust: "96", waist: "81", hips: "104", length: "114" },
    ]
  },
  "Kurta": {
    inches: [
      { size: "S", chest: "38", length: "40", shoulder: "17.5" },
      { size: "M", chest: "40", length: "42", shoulder: "18.5" },
      { size: "L", chest: "42", length: "44", shoulder: "19.5" },
      { size: "XL", chest: "44", length: "45", shoulder: "20.5" },
      { size: "XXL", chest: "46", length: "46", shoulder: "21.5" },
    ],
    cm: [
      { size: "S", chest: "96", length: "101", shoulder: "44.5" },
      { size: "M", chest: "102", length: "106", shoulder: "47" },
      { size: "L", chest: "107", length: "112", shoulder: "49.5" },
      { size: "XL", chest: "112", length: "114", shoulder: "52" },
      { size: "XXL", chest: "117", length: "117", shoulder: "54.5" },
    ]
  }
};

const SAMPLE_REVIEWS = [
  {
    name: "Aarav Sharma",
    rating: 5,
    date: "18 Aug 2026",
    verified: true,
    title: "Exceptional quality & tailor-made fit!",
    comment: "The fabric weight and stitching details are top notch. Received so many compliments. Exactly matches the photos."
  },
  {
    name: "Pooja Varma",
    rating: 5,
    date: "14 Aug 2026",
    verified: true,
    title: "Luxurious feel, definitely ordering again",
    comment: "Fast delivery to Bangalore within 3 days. The fabric is super breathable and doesn't shrink after wash."
  },
  {
    name: "Rohan Nair",
    rating: 4,
    date: "09 Aug 2026",
    verified: true,
    title: "Great aesthetic & fast shipping",
    comment: "Rich burgundy color and very comfortable silhouette. Highly recommended for festive gatherings."
  }
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { toggle, has } = useWishlist();

  // Size chart modal state
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState("inches"); // "inches" | "cm"

  // Pincode estimator state
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Active accordion tab
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    setImgIdx(0);
    setPincodeStatus(null);
    api.get(`/products/${slug}`).then(r => {
      setProduct(r.data);
      setSize(r.data.sizes?.[0] || null);
      setColor(r.data.colors?.[0] || null);
    });
  }, [slug]);

  if (!product) return <div className="max-w-6xl mx-auto p-20 text-navy/60">Loading...</div>;

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (product.sizes?.length && !size) { toast.error("Please select a size"); return; }
    add(product, { quantity: qty, size, color });
    toast.success(`${product.title} (${size || "Std"}) added to cart!`);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian Pincode");
      return;
    }
    // Calculate estimated delivery: 3 business days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateStr = deliveryDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    setPincodeStatus({
      valid: true,
      date: dateStr,
      cod: true,
      freeDelivery: product.price >= 999
    });
    toast.success(`Deliverable to ${pincode}! Expected by ${dateStr}.`);
  };

  const chartCategory = (product.category === "Kurta") ? "Kurta" : (product.category === "Women" ? "Women" : "T-Shirts");
  const chartData = SIZE_CHARTS[chartCategory]?.[sizeUnit] || SIZE_CHARTS["T-Shirts"][sizeUnit];

  const discountPercent = (product.compare_at_price && product.compare_at_price > product.price)
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12" data-testid="product-detail-page">
      {/* Breadcrumbs */}
      <div className="text-xs tracking-widest uppercase text-navy/50 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-navy">Home</Link> / 
        <Link to="/products" className="hover:text-navy">Shop</Link> / 
        <Link to={`/collections/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-navy">{product.category}</Link> / 
        <span className="text-navy font-semibold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Gallery */}
        <div>
          <div className="aspect-[3/4] bg-[#F0EDE4] overflow-hidden relative group" data-testid="product-gallery">
            {product.images?.[imgIdx] ? (
              <img src={product.images[imgIdx]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-navy/30 font-serif text-4xl">BEVOQ</div>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#580018] text-gold font-bold text-xs uppercase tracking-wider px-3 py-1 shadow-lg">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-3">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={()=>setImgIdx(i)} 
                  className={`aspect-square overflow-hidden border-2 transition-all ${i===imgIdx ? "border-navy ring-1 ring-navy" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <span className="overline text-gold font-semibold">{product.category}</span>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span className="font-bold">4.8</span>
              <span className="text-navy/50">| 42 Reviews</span>
            </div>
          </div>

          <h1 className="serif-display text-3xl md:text-5xl mt-2 text-navy" data-testid="product-title">{product.title}</h1>

          {/* Price with savings */}
          <div className="flex items-baseline gap-3 mt-4">
            <div className="text-3xl text-navy font-semibold" data-testid="product-price">{formatINR(product.price)}</div>
            {product.compare_at_price && (
              <>
                <div className="text-xl text-navy/40 line-through">{formatINR(product.compare_at_price)}</div>
                <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {formatINR(product.compare_at_price - product.price)} ({discountPercent}% OFF)
                </div>
              </>
            )}
          </div>
          <p className="text-[11px] text-navy/50 mt-1">Inclusive of all taxes. Free shipping above ₹999.</p>

          {/* Short description */}
          <p className="text-navy/70 mt-6 leading-relaxed text-sm md:text-base" data-testid="product-description">{product.description}</p>

          {/* Size Selector + Size Guide Link */}
          {product.sizes?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-navy/10">
              <div className="flex items-center justify-between mb-3">
                <div className="overline text-navy">Select Size</div>
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-navy/80 hover:text-gold font-medium underline underline-offset-4"
                  data-testid="size-guide-btn"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    onClick={()=>setSize(s)} 
                    className={`min-w-[48px] h-12 px-3 border text-sm font-medium transition-all ${size===s ? "bg-navy text-white border-navy shadow-md" : "border-navy/20 hover:border-navy bg-white"}`} 
                    data-testid={`size-${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <div className="overline text-navy mb-3">Color: <span className="text-navy/70 normal-case tracking-normal font-semibold">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button 
                    key={c} 
                    onClick={()=>setColor(c)} 
                    className={`px-4 h-10 border text-sm transition-all ${color===c ? "bg-navy text-white border-navy shadow-sm" : "border-navy/20 hover:border-navy bg-white"}`} 
                    data-testid={`color-${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Stock Urgency */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="overline text-navy mb-2">Quantity</div>
              <div className="flex items-center border border-navy/20 w-max bg-white">
                <button onClick={()=>setQty(Math.max(1, qty-1))} className="w-10 h-10 hover:bg-navy/5 font-bold">−</button>
                <span className="w-12 text-center text-sm font-semibold" data-testid="qty-display">{qty}</span>
                <button onClick={()=>setQty(qty+1)} className="w-10 h-10 hover:bg-navy/5 font-bold">+</button>
              </div>
            </div>

            {/* Low stock urgency alert */}
            {product.stock > 0 && product.stock <= 40 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-2 border border-amber-200/70 rounded">
                <Sparkles size={14} className="text-amber-600" />
                <span>🔥 High Demand: Only {product.stock} items left</span>
              </div>
            )}
          </div>

          {/* Add to Cart & Wishlist Actions */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={handleAdd} 
              disabled={outOfStock} 
              className="btn-primary flex-1 py-4 text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2" 
              data-testid="add-to-cart-btn"
            >
              {outOfStock ? "Sold Out" : `Add to Cart • ${formatINR(product.price * qty)}`}
            </button>
            <button 
              onClick={() => toggle(product)} 
              className={`w-14 h-[54px] border flex items-center justify-center transition-colors ${has(product.slug) ? "border-gold text-gold fill-gold bg-gold/5" : "border-navy text-navy hover:border-gold hover:text-gold bg-white"}`} 
              data-testid="wishlist-btn-detail"
              aria-label="Save to Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} fill={has(product.slug) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="mt-8 p-4 bg-white border border-navy/15 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
              <MapPin size={15} className="text-gold" /> Check Delivery & COD Availability
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                className="flex-1 border border-navy/20 px-3 py-2 text-sm rounded focus:outline-none focus:border-navy"
                data-testid="pincode-input"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-navy text-white text-xs uppercase tracking-wider font-semibold hover:bg-navy/90 rounded"
                data-testid="pincode-check-btn"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <div className="mt-3 pt-3 border-t border-navy/10 text-xs text-navy/80 space-y-1.5">
                <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 size={14} /> Express delivery to {pincode} by <strong>{pincodeStatus.date}</strong>
                </p>
                <p className="flex items-center gap-1.5 text-navy/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy/40"></span> Cash on Delivery (COD) Available
                </p>
                <p className="flex items-center gap-1.5 text-navy/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy/40"></span> {pincodeStatus.freeDelivery ? "Eligible for FREE Delivery" : "Add items to unlock Free Delivery"}
                </p>
              </div>
            )}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-navy/10">
            <div className="text-center p-2 rounded bg-white border border-navy/5">
              <Truck size={20} className="mx-auto text-gold mb-1.5" strokeWidth={1.5} />
              <div className="text-[10px] tracking-widest uppercase font-semibold text-navy">Free Ship ₹999+</div>
            </div>
            <div className="text-center p-2 rounded bg-white border border-navy/5">
              <RotateCcw size={20} className="mx-auto text-gold mb-1.5" strokeWidth={1.5} />
              <div className="text-[10px] tracking-widest uppercase font-semibold text-navy">7-Day Easy Return</div>
            </div>
            <div className="text-center p-2 rounded bg-white border border-navy/5">
              <ShieldCheck size={20} className="mx-auto text-gold mb-1.5" strokeWidth={1.5} />
              <div className="text-[10px] tracking-widest uppercase font-semibold text-navy">100% Genuine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Product Details, Fabric Care & Customer Reviews */}
      <div className="mt-20 pt-10 border-t border-navy/10">
        <div className="flex border-b border-navy/15 gap-8 overflow-x-auto">
          {[
            { id: "description", label: "Product Details & Specifications" },
            { id: "fabric", label: "Fabric & Wash Care" },
            { id: "reviews", label: "Customer Reviews (42)" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm uppercase tracking-wider font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? "border-navy text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="max-w-3xl space-y-4 text-sm text-navy/80 leading-relaxed">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Silhouette:</strong> Tailored contemporary cut for maximum comfort and style.</li>
                <li><strong>Fit:</strong> True to size (designed for regular to relaxed styling).</li>
                <li><strong>Occasion:</strong> Versatile wear — ideal for casual outings, festive occasions, and evening events.</li>
                <li><strong>Origin:</strong> Designed and crafted in India with bespoke artisanal finishes.</li>
              </ul>
            </div>
          )}

          {activeTab === "fabric" && (
            <div className="max-w-3xl space-y-4 text-sm text-navy/80 leading-relaxed">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-navy/10 rounded">
                  <h4 className="font-bold text-navy mb-2">Fabric Composition</h4>
                  <p className="text-xs text-navy/70 leading-relaxed">
                    {product.category === "Kurta" ? "Pure Raw Silk & Cotton blend with high-density gold zari embroidery." : (product.category === "Women" ? "Liquid Silk / Modal blend with lightweight breathable drape." : "100% Premium Combed Cotton, 240 GSM Bio-Washed French Terry.")}
                  </p>
                </div>
                <div className="p-4 bg-white border border-navy/10 rounded">
                  <h4 className="font-bold text-navy mb-2">Wash & Care Instructions</h4>
                  <ul className="text-xs text-navy/70 space-y-1 list-disc pl-4">
                    <li>Dry clean or gentle cold machine wash.</li>
                    <li>Do not bleach or tumble dry.</li>
                    <li>Warm iron inside out on low heat setting.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="flex flex-wrap items-center gap-8 p-6 bg-white border border-navy/10 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-serif text-navy font-bold">4.8</div>
                  <div className="flex justify-center text-amber-500 my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-500" />)}
                  </div>
                  <div className="text-xs text-navy/50">Based on 42 reviews</div>
                </div>

                <div className="flex-1 min-w-[200px] border-l border-navy/10 pl-6 space-y-1.5 text-xs text-navy/70">
                  <div className="flex items-center gap-3"><span>5 Star</span><div className="flex-1 h-2 bg-navy/10 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-amber-500"></div></div><span>85%</span></div>
                  <div className="flex items-center gap-3"><span>4 Star</span><div className="flex-1 h-2 bg-navy/10 rounded-full overflow-hidden"><div className="w-[12%] h-full bg-amber-500"></div></div><span>12%</span></div>
                  <div className="flex items-center gap-3"><span>3 Star</span><div className="flex-1 h-2 bg-navy/10 rounded-full overflow-hidden"><div className="w-[3%] h-full bg-amber-500"></div></div><span>3%</span></div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {SAMPLE_REVIEWS.map((rev, i) => (
                  <div key={i} className="p-5 bg-white border border-navy/10 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, idx) => <Star key={idx} size={13} className="fill-amber-500" />)}
                      </div>
                      <span className="text-[11px] text-navy/40">{rev.date}</span>
                    </div>
                    <h5 className="font-semibold text-sm text-navy">{rev.title}</h5>
                    <p className="text-xs text-navy/70 leading-relaxed">{rev.comment}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 size={12} /> {rev.name} (Verified Buyer)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Chart Modal */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSizeModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-navy/10">
              <div>
                <h3 className="font-serif text-2xl text-navy">Size Guide</h3>
                <p className="text-xs text-navy/50 uppercase tracking-wider">{product.category} Measurements</p>
              </div>
              <button onClick={() => setSizeModalOpen(false)} className="text-navy/40 hover:text-navy">
                <X size={20} />
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center justify-between mt-5 mb-4">
              <span className="text-xs text-navy/70">Measurements in:</span>
              <div className="flex border border-navy/20 rounded overflow-hidden">
                <button
                  onClick={() => setSizeUnit("inches")}
                  className={`px-3 py-1 text-xs font-semibold ${sizeUnit === "inches" ? "bg-navy text-white" : "bg-white text-navy/70"}`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1 text-xs font-semibold ${sizeUnit === "cm" ? "bg-navy text-white" : "bg-white text-navy/70"}`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-navy/10 rounded">
              <table className="w-full text-xs text-left">
                <thead className="bg-navy/5 uppercase text-navy/60 font-semibold">
                  <tr>
                    <th className="p-3">Size</th>
                    {chartData[0]?.chest && <th className="p-3">Chest ({sizeUnit})</th>}
                    {chartData[0]?.bust && <th className="p-3">Bust ({sizeUnit})</th>}
                    {chartData[0]?.waist && <th className="p-3">Waist ({sizeUnit})</th>}
                    {chartData[0]?.hips && <th className="p-3">Hips ({sizeUnit})</th>}
                    {chartData[0]?.shoulder && <th className="p-3">Shoulder ({sizeUnit})</th>}
                    {chartData[0]?.length && <th className="p-3">Length ({sizeUnit})</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10 text-navy">
                  {chartData.map((row, idx) => (
                    <tr key={idx} className={row.size === size ? "bg-gold/10 font-bold" : "hover:bg-navy/5"}>
                      <td className="p-3 font-semibold text-navy">{row.size}</td>
                      {row.chest && <td className="p-3">{row.chest}</td>}
                      {row.bust && <td className="p-3">{row.bust}</td>}
                      {row.waist && <td className="p-3">{row.waist}</td>}
                      {row.hips && <td className="p-3">{row.hips}</td>}
                      {row.shoulder && <td className="p-3">{row.shoulder}</td>}
                      {row.length && <td className="p-3">{row.length}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-navy/50 mt-4 leading-relaxed">
              💡 <strong>Fit Tip:</strong> If you prefer a relaxed or streetwear drape, we suggest sizing up one size.
            </p>
          </div>
        </div>
      )}

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-navy/15 p-3.5 z-30 md:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="truncate">
          <div className="text-xs text-navy font-bold truncate">{product.title}</div>
          <div className="text-sm font-bold text-navy">{formatINR(product.price)}</div>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-bold shrink-0 shadow-lg"
        >
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
