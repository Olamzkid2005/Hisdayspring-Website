"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Church, Eye, Users, Globe } from "lucide-react";
import { aboutContent, statistics } from "@/data";
import { useCounterAnimation } from "@/hooks";

function AnimatedCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCounterAnimation(value, isInView, { duration: 2000 });

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-5xl md:text-6xl font-bold text-primary-900 mb-2">
        <span>{count}</span>
        <span className="text-accent-500">{suffix}</span>
      </div>
      <div className="text-white/70 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-28 md:py-36 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
            <Church className="w-4 h-4" />
            About Our Church
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Who We Are
          </h2>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-900">Our Mission</h3>
            </div>
            <blockquote className="text-lg text-muted leading-relaxed border-l-4 border-accent-500 pl-6">
              &ldquo;{aboutContent.mission}&rdquo;
            </blockquote>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-900">Our Vision</h3>
            </div>
            <blockquote className="text-lg text-muted leading-relaxed border-l-4 border-primary-600 pl-6">
              &ldquo;{aboutContent.vision}&rdquo;
            </blockquote>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary-900 rounded-3xl p-12 md:p-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Branch Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-muted">
            <Users className="w-5 h-5" />
            <span>{aboutContent.branchInfo}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
