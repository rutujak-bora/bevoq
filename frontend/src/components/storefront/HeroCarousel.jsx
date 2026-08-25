import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Fallback initial luxury slides if API is initializing
const DEFAULT_SLIDES = [
  {
    id: "banner-1",
    title: "Fashion for Everyone, Every Day.",
    subtitle: "Season 2026 · Unisex Fashion",
    description: "Discover considered unisex streetwear, oversized drops, and effortless daily essentials.",
    image_url: "https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?w=1920&q=85",
    cta_text: "Shop T-Shirts",
    cta_link: "/collections/t-shirts",
    secondary_cta_text: "Our Story",
    secondary_cta_link: "/about",
    order: 1
  },
  {
    id: "banner-2",
    title: "Royal Men's Kurta & Festive Heritage.",
    subtitle: "Artisanal Craft · Exclusive for Men",
    description: "Handcrafted Chikankari, raw silk, and embroidered jacquard kurtas for festive celebrations.",
    image_url: "/images/kurta/kurta_banner.jpg",
    cta_text: "Explore Kurtas",
    cta_link: "/collections/kurta",
    secondary_cta_text: "All Products",
    secondary_cta_link: "/products",
    order: 2
  },
  {
    id: "banner-3",
    title: "Modern Western Dresses & Silhouettes.",
    subtitle: "Elegance in Motion · Women's Edit",
    description: "Tailored liquid silk dresses, structured crop shirts, and statement printed blouses.",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=85",
    cta_text: "Shop Women",
    cta_link: "/collections/women",
    secondary_cta_text: "Trending Now",
    secondary_cta_link: "/trending",
    order: 3
  },
  {
    id: "banner-4",
    title: "Custom Printing & Low-MOQ Bulk Orders.",
    subtitle: "Your Vision · Our Atelier Craft",
    description: "High-density screen prints, 3D puff embroidery, and customized private-label manufacturing.",
    image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&q=85",
    cta_text: "Request Quote",
    cta_link: "/bulk-custom",
    secondary_cta_text: "WhatsApp Us",
    secondary_cta_link: "https://wa.me/919604508513",
    order: 4
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    api.get("/banners")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch banners from API, using default slides:", err);
      });
  }, []);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, total]);

  // Handle Touch Swipes on Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      className="relative h-[85vh] min-h-[580px] max-h-[900px] w-full overflow-hidden bg-navy select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-testid="hero-carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with subtle zoom on active */}
            <img
              src={slide.image_url}
              alt={slide.title}
              style={{ transitionDuration: "6000ms" }}
              className={`absolute inset-0 w-full h-full object-cover transform transition-transform ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />

            {/* Luxury Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-transparent" />

            {/* Slide Content Overlay */}
            <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-end pb-20 md:pb-24">
              <div className={`text-white max-w-2xl transition-all duration-700 delay-200 transform ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}>
                {/* Subtitle / Overline */}
                {slide.subtitle && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4 backdrop-blur-sm">
                    <Sparkles size={13} className="text-gold" />
                    <span>{slide.subtitle}</span>
                  </div>
                )}

                {/* Title */}
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-light text-white drop-shadow-md">
                  {slide.title}
                </h1>

                {/* Description */}
                {slide.description && (
                  <p className="mt-4 text-white/85 text-base md:text-lg max-w-lg leading-relaxed font-light drop-shadow">
                    {slide.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 mt-8">
                  {slide.cta_link && (
                    slide.cta_link.startsWith("http") ? (
                      <a
                        href={slide.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-3.5 px-8 text-xs uppercase tracking-widest font-bold shadow-2xl"
                      >
                        {slide.cta_text || "Shop Now"}
                      </a>
                    ) : (
                      <Link
                        to={slide.cta_link}
                        className="btn-primary py-3.5 px-8 text-xs uppercase tracking-widest font-bold shadow-2xl"
                      >
                        {slide.cta_text || "Shop Now"}
                      </Link>
                    )
                  )}

                  {slide.secondary_cta_link && (
                    slide.secondary_cta_link.startsWith("http") ? (
                      <a
                        href={slide.secondary_cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline border-white/80 text-white hover:bg-white hover:text-burgundy py-3.5 px-6 text-xs uppercase tracking-widest font-medium backdrop-blur-xs"
                      >
                        {slide.secondary_cta_text || "Learn More"}
                      </a>
                    ) : (
                      <Link
                        to={slide.secondary_cta_link}
                        className="btn-outline border-white/80 text-white hover:bg-white hover:text-burgundy py-3.5 px-6 text-xs uppercase tracking-widest font-medium backdrop-blur-xs"
                      >
                        {slide.secondary_cta_text || "Learn More"}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Desktop) */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all hover:scale-105"
            data-testid="hero-prev-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all hover:scale-105"
            data-testid="hero-next-btn"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots / Indicators */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-8 bg-gold shadow-md"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              data-testid={`hero-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
