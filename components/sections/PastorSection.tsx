"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Users, BookOpen, Heart } from "lucide-react";
import { pastorInfo, spouseInfo } from "@/data";

export function PastorSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pastor" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Our Shepherd
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Meet Our Pastor
          </h2>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full" />
        </motion.div>

        {/* Pastor Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-primary-100">
              {/* Placeholder image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-accent-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-primary-900 font-serif font-bold text-5xl">
                        {pastorInfo.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-primary-700/50 text-sm">Photo coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent-500/10 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-900/5 rounded-3xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:pt-8"
          >
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">
              {pastorInfo.name}
            </h3>
            <p className="text-accent-600 font-medium mb-6">{pastorInfo.title}</p>

            <div className="prose prose-lg text-muted mb-8">
              {pastorInfo.biography.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Education */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-accent-500" />
                <h4 className="font-serif font-bold text-primary-900">Education</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {pastorInfo.education.map((edu) => (
                  <span
                    key={edu}
                    className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full"
                  >
                    {edu}
                  </span>
                ))}
              </div>
            </div>

            {/* Ministries */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-accent-500" />
                <h4 className="font-serif font-bold text-primary-900">Ministries Founded</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {pastorInfo.ministries.map((ministry) => (
                  <span
                    key={ministry}
                    className="px-3 py-1.5 bg-accent-50 text-accent-700 text-sm rounded-full"
                  >
                    {ministry}
                  </span>
                ))}
              </div>
            </div>

            {/* Family */}
            <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
              <Heart className="w-5 h-5 text-accent-500 mt-1 flex-shrink-0" />
              <div className="text-sm text-muted">
                <span className="font-medium text-primary-900">{pastorInfo.spouse}</span> -{" "}
                {pastorInfo.title}
                <br />
                {pastorInfo.children}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Spouse Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 pt-16 border-t border-primary-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
                {spouseInfo.name}
              </h3>
              <p className="text-accent-600 font-medium mb-4">{spouseInfo.title}</p>
              <p className="text-muted leading-relaxed">{spouseInfo.biography}</p>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square max-w-sm rounded-3xl overflow-hidden bg-primary-100 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-accent-200 to-accent-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-accent-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-primary-900 font-serif font-bold text-3xl">
                        {spouseInfo.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-primary-700/50 text-sm">Photo coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
