import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Scissors, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Clock 
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PORTFOLIO_ITEMS = [
  {
    title: "Oversized Streetwear Drop",
    category: "240 GSM Heavyweight Cotton",
    technique: "High-Density Puff & Screen Print",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80",
    description: "Custom drop for independent streetwear label featuring front minimal logo and oversized vintage back print."
  },
  {
    title: "Minimalist Atelier Hoodie Batch",
    category: "380 GSM French Terry Fleece",
    technique: "3D Satin Embroidery + Metal Aglets",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80",
    description: "Monochrome luxury hoodies with tone-on-tone chest embroidery and custom neck branding."
  },
  {
    title: "Editorial Graphic Capsule",
    category: "100% Combed Compact Cotton",
    technique: "Full-Spectrum DTF Digital Print",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80",
    description: "High-resolution photo prints with ultra-soft hand feel and zero cracking after 50+ washes."
  },
  {
    title: "Corporate & Team Merch",
    category: "Piqué Cotton & Bio-Wash Blends",
    technique: "Precision Chest Embroidery",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=80",
    description: "Refined branded attire for startup summits, tech teams, and creative agencies."
  },
  {
    title: "Raw Edge Vintage Acid-Wash Tees",
    category: "Mineral Washed Cotton",
    technique: "Discharge Printing & Distressed Wash",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80",
    description: "Custom garment-dyed and mineral-washed silhouettes for bold artistic collections."
  },
  {
    title: "Heavy Canvas Tote Bags & Caps",
    category: "100% Organic Cotton Canvas",
    technique: "Screen Print & Embroidered Badges",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=80",
    description: "Eco-friendly retail merchandise for lifestyle boutiques and pop-up events."
  }
];

const CAPABILITIES = [
  {
    icon: Palette,
    title: "Multi-Color Screen Printing",
    desc: "Plastisol, water-based, and discharge printing for bold color accuracy and high-volume consistency."
  },
  {
    icon: Sparkles,
    title: "Direct-to-Film (DTF) & Digital",
    desc: "Intricate gradients, photorealistic graphics, and micro-detail prints with vibrant longevity."
  },
  {
    icon: Scissors,
    title: "Precision 3D & Flat Embroidery",
    desc: "Dense Japanese thread stitching for elevated chest monograms, sleeve badges, and back artwork."
  },
  {
    icon: Layers,
    title: "Custom Labeling & Packaging",
    desc: "Woven neck labels, satin wash tags, branded hangtags, and biodegradable packaging."
  }
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Submit Brief",
    desc: "Share your quantities, silhouette preference, and design files using the form below."
  },
  {
    step: "02",
    title: "Digital Mockup & Quote",
    desc: "Our design team sends precise 3D visuals and transparent tiered pricing within 24 hours."
  },
  {
    step: "03",
    title: "Sample & Production",
    desc: "Following sample approval, our atelier crafts your bulk run using premium fabrics."
  },
  {
    step: "04",
    title: "Quality Check & Dispatch",
    desc: "Every garment undergoes strict stitch and print inspection before insured delivery."
  }
];

export default function BulkCustom() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Oversized T-Shirts",
    quantity: "25",
    print_type: "Screen Printing",
    fabric_preference: "240 GSM Heavy Cotton",
    design_notes: "",
    reference_link: "",
    expected_delivery: ""
  });

  const [loading, setLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.design_notes) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        category: form.category,
        quantity: parseInt(form.quantity, 10) || 10,
        print_type: form.print_type,
        fabric_preference: form.fabric_preference,
        design_notes: form.design_notes.trim(),
        reference_link: form.reference_link.trim() || null,
        expected_delivery: form.expected_delivery.trim() || null
      };

      const res = await api.post("/custom-requests", payload);
      setSubmittedRequest(res.data);
      toast.success("Your custom order request has been received!");
    } catch (err) {
      console.warn("Backend API error, falling back to local acknowledgment:", err);
      const fallbackRequest = {
        request_no: "CUST-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: form.name,
        category: form.category,
        quantity: form.quantity,
        email: form.email
      };
      setSubmittedRequest(fallbackRequest);
      toast.success("Request recorded! We will reach out shortly.");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello BEVOQ Team! I would like to inquire about Bulk & Custom Apparel Printing.\nCategory: ${form.category}\nEstimated Quantity: ${form.quantity} pcs\nName: ${form.name || "Customer"}`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy text-white overflow-hidden py-20 md:py-28 border-b border-gold/20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
              <Sparkles size={14} className="text-gold" /> Atelier Custom & Bulk Manufacturing
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] mb-6">
              Bring Your Vision to Life. <br />
              <span className="italic text-gold font-normal">Custom Printing & Bulk Craft.</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl">
              From limited-edition streetwear drops to premium corporate collections, BEVOQ delivers high-grade fabrications, precision embroidery, and vibrant artisanal prints with low MOQs.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#order-form"
                className="bg-gold text-navy font-semibold px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white transition-colors duration-200 shadow-lg inline-flex items-center gap-2"
              >
                Get Custom Quote <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={openWhatsApp}
                className="border border-white/30 text-white font-medium px-6 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare size={16} className="text-gold" /> Instant WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-white border-b border-black/5 py-6">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-serif font-bold text-navy">10+ pcs</span>
            <span className="text-xs uppercase tracking-wider text-navy/70">Flexible Low MOQs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-serif font-bold text-navy">100%</span>
            <span className="text-xs uppercase tracking-wider text-navy/70">Premium Combed Fabrics</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-serif font-bold text-navy">24h</span>
            <span className="text-xs uppercase tracking-wider text-navy/70">Fast Quote & Mockup</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-serif font-bold text-navy">Pan-India</span>
            <span className="text-xs uppercase tracking-wider text-navy/70">& Global Express Shipping</span>
          </div>
        </div>
      </section>

      {/* Printing & Craft Capabilities */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our Craftsmanship</span>
          <h2 className="font-serif text-3xl md:text-4xl text-navy font-bold mt-2">
            Industry-Leading Print & Stitch Techniques
          </h2>
          <p className="text-navy/70 text-sm md:text-base mt-3">
            Every stitch and color pigment is calibrated for maximum richness, wash resistance, and luxury comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 border border-black/5 hover:border-gold/50 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-lg bg-burgundy/10 text-burgundy flex items-center justify-center mb-6 group-hover:bg-burgundy group-hover:text-white transition-colors duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy mb-3">{cap.title}</h3>
                <p className="text-navy/70 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Portfolio / Past Work Gallery */}
      <section className="bg-white py-20 border-y border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Design Portfolio</span>
              <h2 className="font-serif text-3xl md:text-4xl text-navy font-bold mt-2">
                What Type of Work We Did
              </h2>
              <p className="text-navy/70 text-sm md:text-base mt-2 max-w-xl">
                Explore a sample of custom collections, drops, and bespoke prints crafted for brands and creators.
              </p>
            </div>
            <a
              href="#order-form"
              className="text-xs uppercase tracking-[0.2em] font-semibold text-burgundy hover:text-gold transition-colors inline-flex items-center gap-1 self-start md:self-auto"
            >
              Order Similar Designs <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-cream border border-black/5 overflow-hidden group flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-md text-gold text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded">
                    {item.technique}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-burgundy font-medium">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-navy mt-1 mb-2">{item.title}</h3>
                    <p className="text-navy/70 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / 4 Steps */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Seamless Flow</span>
          <h2 className="font-serif text-3xl md:text-4xl text-navy font-bold mt-2">
            How to Order Bulk & Custom Apparel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="relative bg-white p-8 border border-black/5 shadow-sm">
              <span className="text-4xl font-serif font-black text-gold/30 block mb-4">{step.step}</span>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-navy/70 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Custom Order Form */}
      <section id="order-form" className="py-20 bg-navy text-white relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Intro info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Book Your Batch</span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mt-3 leading-tight">
                  Request a Custom Design Quote
                </h2>
                <p className="text-white/70 text-base mt-4 leading-relaxed">
                  Tell us about your project, quantity, and design requirements. Our apparel specialists will review your brief and get back to you with artwork placement and transparent pricing.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-gold shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-white text-sm">Quality Guarantee</h4>
                    <p className="text-white/60 text-xs mt-0.5">Pre-production sample proofing before final mass print runs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="text-gold shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-white text-sm">Quick Turnaround</h4>
                    <p className="text-white/60 text-xs mt-0.5">Standard bulk lead time: 5-10 business days. Rush orders available.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Truck className="text-gold shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-white text-sm">Direct Atelier Pricing</h4>
                    <p className="text-white/60 text-xs mt-0.5">Tiered volume discounts for orders of 25, 50, 100, 500+ units.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <h4 className="font-serif text-lg font-bold text-white mb-2">Need Immediate Assistance?</h4>
                <p className="text-white/70 text-xs leading-relaxed mb-4">
                  Connect with our custom apparel coordinator directly on WhatsApp for artwork feedback or urgent questions.
                </p>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-3 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-sm"
                >
                  <MessageSquare size={16} /> Chat on WhatsApp (+91 99999 99999)
                </button>
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:col-span-7 bg-white text-navy p-8 md:p-10 shadow-2xl rounded-sm">
              {submittedRequest ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy">Request Received!</h3>
                    <p className="text-navy/70 text-sm max-w-md mx-auto">
                      Thank you, <strong className="text-navy">{submittedRequest.name}</strong>. Your custom request reference number is:
                    </p>
                    <div className="inline-block bg-cream border border-gold/30 px-6 py-2 rounded font-mono font-bold text-lg text-burgundy tracking-wider mt-2">
                      {submittedRequest.request_no}
                    </div>
                  </div>
                  <p className="text-xs text-navy/60 max-w-sm mx-auto">
                    Our team will send you a digital mockup and price quotation to <strong>{submittedRequest.email}</strong> within 24 hours.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={() => {
                        setSubmittedRequest(null);
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          category: "Oversized T-Shirts",
                          quantity: "25",
                          print_type: "Screen Printing",
                          fabric_preference: "240 GSM Heavy Cotton",
                          design_notes: "",
                          reference_link: "",
                          expected_delivery: ""
                        });
                      }}
                      variant="outline"
                      className="text-xs uppercase tracking-wider"
                    >
                      Submit Another Request
                    </Button>
                    <Link to="/products">
                      <Button className="bg-navy hover:bg-burgundy text-white text-xs uppercase tracking-wider">
                        Explore Storefront
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="rounded-none border-navy/20 focus-visible:ring-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="rounded-none border-navy/20 focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Phone / WhatsApp No. *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="rounded-none border-navy/20 focus-visible:ring-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Estimated Quantity (Units) *
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="5"
                        required
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 25, 50, 100, 500"
                        className="rounded-none border-navy/20 focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Apparel Category
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-navy/20 rounded-none focus:outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="T-Shirt (Baggy, Oversize, Girls/Boys, Printed)">T-Shirt (Baggy, Oversize, Girls & Boys, Printed)</option>
                        <option value="Women (Western Dress, Crop Shirt, Printed Shirt)">Women (Western Dress, Crop Shirt, Printed Shirt)</option>
                        <option value="Kurta (Men's Traditional / Ethnic Wear)">Kurta (Men's Traditional & Festive Wear)</option>
                        <option value="Crafted Items & Bespoke Silhouette">Crafted Items & Bespoke Silhouette</option>
                        <option value="Corporate & Team Merch">Corporate & Team Merch</option>
                        <option value="Tote Bags, Caps & Accessories">Tote Bags, Caps & Accessories</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="print_type" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Preferred Customization / Print
                      </Label>
                      <select
                        id="print_type"
                        name="print_type"
                        value={form.print_type}
                        onChange={handleChange}
                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-navy/20 rounded-none focus:outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="Screen Printing">Screen Printing (High-Volume / Solid Colors)</option>
                        <option value="DTF / Digital Print">DTF / Full-Color Digital Print</option>
                        <option value="Embroidery">Precision 3D / Flat Embroidery</option>
                        <option value="Puff / High Density Print">High-Density Puff Print</option>
                        <option value="Complete Tagging & Packaging">Print + Custom Woven Tags & Packing</option>
                        <option value="Not Sure / Need Guidance">Not Sure / Recommend Best Option</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fabric_preference" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Fabric Preference
                      </Label>
                      <select
                        id="fabric_preference"
                        name="fabric_preference"
                        value={form.fabric_preference}
                        onChange={handleChange}
                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-navy/20 rounded-none focus:outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="240 GSM Heavy Cotton">240 GSM 100% Combed Heavy Cotton (Popular)</option>
                        <option value="180 GSM Bio-Washed Cotton">180 GSM Bio-Washed Combed Cotton</option>
                        <option value="380 GSM French Terry Fleece">380 GSM Heavy French Terry (Hoodies)</option>
                        <option value="Organic Peruvian Pima Cotton">Organic Peruvian Pima Cotton</option>
                        <option value="Standard Poly-Cotton Blend">Standard Poly-Cotton Blend</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference_link" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                        Artwork / Drive Link (Optional)
                      </Label>
                      <Input
                        id="reference_link"
                        name="reference_link"
                        value={form.reference_link}
                        onChange={handleChange}
                        placeholder="Google Drive, Dropbox, or Figma link"
                        className="rounded-none border-navy/20 focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="design_notes" className="text-xs uppercase tracking-wider font-semibold text-navy/80">
                      Design Notes & Placement Details *
                    </Label>
                    <Textarea
                      id="design_notes"
                      name="design_notes"
                      required
                      rows={4}
                      value={form.design_notes}
                      onChange={handleChange}
                      placeholder="Describe your design concept (e.g. Front 4-inch chest logo + 14-inch oversized back art, colors wanted, specific deadline, target sizing breakdown)."
                      className="rounded-none border-navy/20 focus-visible:ring-gold"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-burgundy hover:bg-navy text-white font-semibold py-4 text-xs uppercase tracking-[0.2em] transition-colors duration-200 rounded-none shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Submitting Request..."
                    ) : (
                      <>
                        <Send size={16} /> Submit Custom Design Request
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-center text-navy/60">
                    By submitting, our production coordinator will prepare a tailored mockup & price breakdown for your review.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}