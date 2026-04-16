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
      className="fixed bottom-6 right-6 z-40 group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-20" />

      {/* Button */}
      <div className="relative w-14 h-14 rounded-full bg-accent-500 hover:bg-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:shadow-accent-500/50 transition-all duration-300 cursor-pointer">
        <MessageCircle className="w-7 h-7 text-primary-900" />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-primary-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Chat with us
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-primary-900" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
