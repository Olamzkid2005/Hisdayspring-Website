"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, MapPin, Calendar } from "lucide-react";
import { serviceTimes } from "@/data";
import type { ServiceTime } from "@/types";

function ServiceCard({ service, index }: { service: ServiceTime; index: number }) {
  const branchColors: Record<string, string> = {
    Ipaja: "bg-accent-50 text-accent-700",
    Ikeja: "bg-primary-50 text-primary-700",
    Both: "bg-purple-50 text-purple-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
          <Clock className="w-6 h-6 text-accent-600" />
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            branchColors[service.branch] || branchColors.Both
          }`}
        >
          {service.branch}
        </span>
      </div>
      <h3 className="font-serif text-xl font-bold text-primary-900 mb-2">
        {service.name}
      </h3>
      <div className="space-y-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-500" />
          <span>{service.day}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-500" />
          <span>{service.time}</span>
        </div>
      </div>
      {service.description && (
        <p className="mt-4 text-sm text-muted/80 leading-relaxed border-t border-primary-100 pt-4">
          {service.description}
        </p>
      )}
    </motion.div>
  );
}

export function ServiceTimesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-28 md:py-36 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Join Us
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Service Times
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            We would love to worship with you! Join us at any of our services and
            experience the presence of God.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTimes.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Location Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-primary-900 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-accent-400" />
              <h3 className="font-serif text-2xl font-bold">Ipaja Branch</h3>
            </div>
            <p className="text-white/70 mb-4">Gowon Estate, Ipaja, Lagos State, Nigeria</p>
            <p className="text-white/50 text-sm">Our main headquarters</p>
          </div>
          <div className="bg-primary-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-accent-400" />
              <h3 className="font-serif text-2xl font-bold">Ikeja Branch</h3>
            </div>
            <p className="text-white/70 mb-4">Ikeja, Lagos State, Nigeria</p>
            <p className="text-white/50 text-sm">Our second location serving Ikeja area</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
