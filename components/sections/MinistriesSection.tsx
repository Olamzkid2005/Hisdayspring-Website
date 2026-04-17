"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Compass, Heart, GraduationCap, HandHeart, Cross, Gift } from "lucide-react";
import { ministries } from "@/data";
import type { Ministry } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Compass,
  Heart,
  GraduationCap,
  HandHeart,
  Cross,
  Gift,
};

function MinistryCard({ ministry, index }: { ministry: Ministry; index: number }) {
  const IconComponent = iconMap[ministry.icon || "Users"] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      {/* Image */}
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-primary-100 mb-6">
        {ministry.imageUrl ? (
          <img
            src={ministry.imageUrl}
            alt={ministry.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
            {IconComponent && (
              <IconComponent className="w-16 h-16 text-primary-500/30" />
            )}
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-medium">Learn More</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-serif text-xl font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors">
        {ministry.name}
      </h3>
      <p className="text-muted text-sm leading-relaxed line-clamp-3">
        {ministry.description}
      </p>
    </motion.div>
  );
}

export function MinistriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ministries" ref={ref} className="py-28 md:py-36 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Our Ministries
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Get Involved
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Join one of our vibrant ministries and discover your place in the body of
            Christ.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Ministries Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <MinistryCard key={ministry.id} ministry={ministry} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted mb-6">
            Interested in joining any of our ministries?
          </p>
          <a
            href="https://wa.me/2349066192155?text=Hello, I would like to join one of the ministries at Hisdayspring"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-full font-medium hover:bg-primary-800 transition-colors"
          >
            Contact Us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
