"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Info, Calendar, Headphones, Mail, ArrowLeft } from "lucide-react";

const quickLinks = [
  { href: "/#about", label: "About Us", icon: Info },
  { href: "/#services", label: "Services", icon: Calendar },
  { href: "/#sermons", label: "Sermons", icon: Headphones },
  { href: "/#contact", label: "Contact", icon: Mail },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8">
          <span className="font-serif text-5xl font-bold text-primary">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
          Sorry, the page you are looking for does not exist. It may have been
          moved or deleted.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-container transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-surface-container-low transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-outline-variant pt-8">
          <p className="text-sm text-on-surface-variant mb-4">
            You can also explore these sections:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg hover:border-outline hover:shadow-sm transition-all text-on-surface hover:text-primary"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}