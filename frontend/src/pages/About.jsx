import React from "react";
import { MessageCircle, Instagram, Play, Film, Palette } from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Q36: 2 Video Concepts for BEVOQ ─────────────────── */
const VIDEO_CONCEPTS = [
  {
    id: 1,
    icon: "🎬",
    tag: "Video Concept 01",
    title: "Wear Your Identity",
    duration: "30–60 Sec · Reel / Short Film",
    description:
      "A cinematic street-style montage showing diverse individuals — students, artists, athletes, professionals — all wearing BEVOQ pieces in their everyday environments. The video captures raw, candid moments of confidence: someone walking into a room, laughing with friends, performing on stage. Transitions are sharp and music-driven (lo-fi hip-hop / indie pop). Ends with the tagline: BEVOQ — Wear Your Identity.",
    scenes: [
      "Scene 1 — Early morning: individual picks up a BEVOQ oversized tee, looks in the mirror with quiet confidence.",
      "Scene 2 — Street: a diverse group of friends in BEVOQ unisex fits walking together in an urban setting.",
      "Scene 3 — Studio: a photographer/creator wearing BEVOQ while at work — fashion meets creativity.",
      "Scene 4 — Close-up shots of DTF print details, fabric texture, and the BEVOQ neck label.",
      "Closing — Black screen, gold BEVOQ logo animates in. Tagline fades: 'Wear Your Identity.'",
    ],
    platform: "Instagram Reels · YouTube Shorts · Website Hero",
    color: "from-navy to-[#0f2050]",
  },
  {
    id: 2,
    icon: "🎥",
    tag: "Video Concept 02",
    title: "The Drop — Limited Edition Launch",
    duration: "15–45 Sec · Product Launch Video",
    description:
      "A hype-driven countdown launch video for a new BEVOQ limited-edition drop. Starts with suspense — dark background, a spotlight slowly revealing the new T-shirt design on a mannequin or model. Camera circles the garment, showcasing the print detail. Then quick cuts: the warehouse packing, a notification on a phone, fans refreshing the website. Ends with a bold 'LIVE NOW' message and the product link.",
    scenes: [
      "Scene 1 — Blackout with heartbeat sound. Spotlight slowly illuminates the new BEVOQ limited tee.",
      "Scene 2 — Macro lens: ultra close-up of DTF print art, stitching, and fabric feel.",
      "Scene 3 — Hands unboxing the BEVOQ package — tissue paper, brand sticker, folded tee.",
      "Scene 4 — Model wearing the drop in a dark, moody studio — attitude and confidence.",
      "Closing — Text flashes: 'LIMITED DROP · AVAILABLE NOW' — BEVOQ website URL appears.",
    ],
    platform: "Instagram Stories · Reels · Meta Ads · WhatsApp Status",
    color: "from-[#580018] to-[#3a0010]",
  },
];

/* ─── Q37: 2 T-shirt Design Concepts ──────────────────── */
const TSHIRT_CONCEPTS = [
  {
    id: 1,
    tag: "Design Concept 01",
    title: "Urban Crest",
    subtitle: "Oversized Streetwear · DTF Print",
    description:
      "A bold chest-center graphic tee featuring the BEVOQ emblem reimagined as a royal crest — combining a crown, laurel wreath, and abstract B-monogram. Printed in metallic gold ink on a deep burgundy or washed black base. The oversized silhouette with dropped shoulders gives it a luxury streetwear feel. Available in Burgundy, Washed Black, and Smoke Grey.",
    details: ["Fabric: 240 GSM Bio-washed Cotton", "Print: DTF Metallic Gold + White", "Fit: Oversized Unisex", "Colors: Burgundy · Washed Black · Smoke Grey"],
    badge: "Streetwear · Unisex · Signature",
    bg: "bg-[#1a0008]",
    accent: "#D4AF37",
  },
  {
    id: 2,
    tag: "Design Concept 02",
    title: "Identity Lines",
    subtitle: "Abstract Minimal · Clean Aesthetic",
    description:
      "A minimalist tee with a single abstract graphic — geometric lines forming a human silhouette in motion, representing freedom and self-expression. Placed on the front-left chest. Below in small clean sans-serif type: 'BEVOQ · Wear Your Identity · MMXXVI'. The design uses a 2-color palette (navy ink on cream, or cream ink on navy) giving it a timeless editorial quality suitable for daily wear.",
    details: ["Fabric: 200 GSM Pima Cotton", "Print: 2-Color DTF / Screen Print", "Fit: Regular & Slim Unisex", "Colors: Cream · Navy · Off-White"],
    badge: "Minimal · Editorial · Everyday",
    bg: "bg-[#0A1A3E]",
    accent: "#FAF8F5",
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <p className="overline text-gold">Our Story</p>
            <h1 className="serif-display text-5xl md:text-7xl mt-4 leading-[0.95]">
              The Art of<br />
              <em className="text-gold not-italic">Everyday Luxury.</em>
            </h1>
            <p className="text-white/70 mt-6 max-w-md">
              A signature. A promise. A way of dressing. BEVOQ is a modern unisex fashion brand built on individuality, confidence, creativity, and self-expression.
            </p>
            <Link to="/products" className="btn-primary mt-8 inline-block">Shop the Collection</Link>
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

      {/* Brand Story */}
      <section className="max-w-[900px] mx-auto px-6 py-20 text-navy leading-relaxed space-y-6">
        <p className="text-2xl font-serif text-navy">
          BEVOQ was born from a simple belief — that fashion belongs to everyone, not just a privileged few.
        </p>
        <p>
          We craft modern unisex pieces — from bold oversized T-shirts to minimal everyday wear — that represent individuality, confidence, and creativity. Our designs are not just clothes; they are a statement of who you are.
        </p>
        <p>
          BEVOQ uses premium DTF printing technology to bring unique, detailed, and long-lasting graphics to life on every garment. Each piece is made with care, comfort-first fabrics, and a design language rooted in modern streetwear aesthetics.
        </p>
        <p className="font-serif italic text-xl text-[#580018]">
          "BEVOQ — Wear Your Identity."
        </p>
      </section>

      {/* ─── Q36: 2 Video Concepts ─── */}
      <section className="bg-[#FAF8F5] py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="overline text-gold flex items-center justify-center gap-2">
              <Film size={16} /> Campaign Vision
            </p>
            <h2 className="serif-display text-4xl md:text-5xl mt-3 text-navy">
              BEVOQ Video Concepts
            </h2>
            <p className="text-navy/60 mt-4 max-w-xl mx-auto">
              Two campaign video concepts crafted to showcase the BEVOQ brand story across digital platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {VIDEO_CONCEPTS.map((vc) => (
              <div key={vc.id} className="rounded-2xl overflow-hidden shadow-xl border border-navy/10 bg-white">
                {/* Header card */}
                <div className={`bg-gradient-to-br ${vc.color} text-white p-8`}>
                  <span className="text-3xl">{vc.icon}</span>
                  <p className="overline text-gold/80 mt-4 text-xs">{vc.tag}</p>
                  <h3 className="serif-display text-3xl mt-2">{vc.title}</h3>
                  <span className="inline-block mt-3 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full border border-white/20">
                    {vc.duration}
                  </span>
                </div>

                <div className="p-8 space-y-6">
                  {/* Concept description */}
                  <p className="text-navy/75 leading-relaxed text-sm">{vc.description}</p>

                  {/* Scene breakdown */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 flex items-center gap-2">
                      <Play size={12} /> Scene Breakdown
                    </p>
                    <ul className="space-y-2">
                      {vc.scenes.map((scene, i) => (
                        <li key={i} className="flex gap-3 text-sm text-navy/70">
                          <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                          <span>{scene}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Platform */}
                  <div className="pt-4 border-t border-navy/10">
                    <p className="text-xs uppercase tracking-widest text-navy/40 font-semibold mb-1">Best For</p>
                    <p className="text-sm text-navy font-medium">{vc.platform}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Q37: 2 T-shirt Design Concepts ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="overline text-gold flex items-center justify-center gap-2">
              <Palette size={16} /> Design Studio
            </p>
            <h2 className="serif-display text-4xl md:text-5xl mt-3 text-navy">
              Signature T-shirt Concepts
            </h2>
            <p className="text-navy/60 mt-4 max-w-xl mx-auto">
              Two original BEVOQ T-shirt design concepts matching our modern streetwear and unisex aesthetic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TSHIRT_CONCEPTS.map((tc) => (
              <div key={tc.id} className="rounded-2xl overflow-hidden shadow-xl border border-navy/10">
                {/* Visual header */}
                <div
                  className={`${tc.bg} flex flex-col items-center justify-center py-16 px-8 text-center`}
                  style={{ minHeight: "260px" }}
                >
                  {/* T-shirt mockup visual */}
                  <div
                    className="w-32 h-36 rounded-lg flex items-center justify-center text-5xl shadow-2xl border-2"
                    style={{ backgroundColor: tc.accent + "22", borderColor: tc.accent + "55" }}
                  >
                    👕
                  </div>
                  <p className="text-xs uppercase tracking-widest mt-5 font-semibold"
                    style={{ color: tc.accent + "cc" }}>
                    {tc.tag}
                  </p>
                  <h3 className="serif-display text-3xl mt-2" style={{ color: tc.accent }}>
                    {tc.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: tc.accent + "99" }}>
                    {tc.subtitle}
                  </p>
                </div>

                <div className="p-8 space-y-5 bg-white">
                  {/* Badge */}
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#FAF8F5] text-gold font-semibold border border-gold/30">
                    {tc.badge}
                  </span>

                  {/* Description */}
                  <p className="text-navy/75 leading-relaxed text-sm">{tc.description}</p>

                  {/* Specs */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">
                      Design Specs
                    </p>
                    <ul className="space-y-2">
                      {tc.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-navy/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Connect */}
      <section className="max-w-[900px] mx-auto px-6 py-16">
        <div className="pt-10 border-t border-navy/15">
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
