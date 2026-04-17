"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { pastorInfo, spouseInfo } from "@/data";

export function PastorSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pastorParagraphs = pastorInfo.biography.split("\n\n");
  const spouseParagraphs = spouseInfo.biography.split("\n\n");

  return (
    <section ref={ref} className="py-16 md:py-32 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end gap-4 md:gap-8 mb-12 md:mb-24"
        >
          <div className="max-w-2xl">
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
              Spiritual Guidance & <em className="text-secondary">Leadership</em>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-outline-variant" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2b?w=600&q=80"
                alt={pastorInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-8">
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface">{pastorInfo.name}</h3>
              <p className="font-label text-secondary font-bold tracking-widest uppercase text-sm mt-1">
                {pastorInfo.title}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {pastorParagraphs.map((p, i) => (
                <p key={i} className="text-on-surface-variant leading-relaxed">{p}</p>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-secondary" />
                <span className="font-label text-secondary font-bold tracking-widest uppercase text-xs">Education</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pastorInfo.education.map((edu) => (
                  <span key={edu} className="px-3 py-1 bg-primary/10 text-on-surface-variant rounded-full text-xs font-medium">
                    {edu}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="font-label text-secondary font-bold tracking-widest uppercase text-xs">Ministries</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pastorInfo.ministries.map((ministry) => (
                  <span key={ministry} className="px-3 py-1 bg-secondary/10 text-on-secondary-container rounded-full text-xs font-medium">
                    {ministry}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative md:mt-24"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a07f5216ba?w=600&q=80"
                alt={spouseInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-8">
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface">{spouseInfo.name}</h3>
              <p className="font-label text-secondary font-bold tracking-widest uppercase text-sm mt-1">
                {spouseInfo.title}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {spouseParagraphs.map((p, i) => (
                <p key={i} className="text-on-surface-variant leading-relaxed">{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}