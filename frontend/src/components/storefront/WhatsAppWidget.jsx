import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppWidget() {
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const phoneNumber = "919604508513";
  const defaultMessage = encodeURIComponent("Hi BEVOQ! I'm browsing your website and have a question regarding an outfit/order.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip banner */}
      {tooltipOpen && (
        <div className="relative bg-white text-navy border border-navy/10 shadow-xl rounded-xl p-3 pr-8 max-w-[260px] text-xs leading-relaxed animate-fade-in cursor-pointer hover:border-gold transition-colors">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTooltipOpen(false);
            }}
            className="absolute top-2 right-2 text-navy/40 hover:text-navy z-10"
            aria-label="Close help tip"
          >
            <X size={14} />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <p className="font-semibold text-navy flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BEVOQ Support Online
            </p>
            <p className="text-navy/70">
              Need help with <strong>sizing</strong>, <strong>custom prints</strong>, or <strong>bulk orders</strong>? <span className="text-emerald-700 font-semibold underline">Chat on WhatsApp</span>
            </p>
          </a>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
        aria-label="Chat on WhatsApp +91 96045 08513"
        data-testid="whatsapp-widget-btn"
      >
        <MessageCircle size={22} className="fill-white text-[#25D366]" />
        <span className="font-semibold text-sm tracking-wide hidden sm:inline">Chat with us</span>
      </a>
    </div>
  );
}
