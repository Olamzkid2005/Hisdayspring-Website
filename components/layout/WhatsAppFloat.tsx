"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { config } from "@/lib/config";

export function WhatsAppFloat() {
  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/\s/g, "").replace("+", "")}?text=${encodeURIComponent(
    "Hello, I would like to know more about Hisdayspring Ministries International."
  )}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-40 group"
    >
      {/* Pulse ring. Desktop only: at phone widths the ring scales past the
          viewport edge and the button covers a third of a testimonial card. */}
      <span className="hidden md:block absolute inset-0 rounded-full bg-secondary-container animate-ping opacity-20" />

      {/* Button */}
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary-container hover:bg-secondary flex items-center justify-center shadow-lg shadow-secondary-container/30 group-hover:shadow-secondary-container/50 transition-all duration-300 cursor-pointer">
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-on-secondary-container" />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-inverse-surface text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Chat with us
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-inverse-surface" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
