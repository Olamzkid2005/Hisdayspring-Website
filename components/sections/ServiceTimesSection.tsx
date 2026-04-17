"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, BookOpen, Users, Church } from "lucide-react";
import { serviceTimes } from "@/data";

export function ServiceTimesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sundayServices = serviceTimes.filter((s) => s.day === "Sunday");
  const midweekServices = serviceTimes.filter((s) => s.day === "Wednesday");
  const youthServices = serviceTimes.filter((s) => s.day === "Friday");
  const otherServices = serviceTimes.filter(
    (s) => !["Sunday", "Wednesday", "Friday"].includes(s.day)
  );

  return (
    <section id="services" ref={ref} className="py-16 md:py-28 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
              Fellowship With Us
            </span>
            <h2 className="font-headline text-3xl md:text-5xl text-on-surface mt-4 leading-tight">
              Sacred Gatherings &amp; Service Times
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg mt-6 leading-relaxed">
              We gather throughout the week in various settings — from Sunday worship
              celebrations to midweek Bible studies and vibrant youth services. Come
              and experience the presence of God with us.
            </p>
          </motion.div>

          <div className="hidden md:flex items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-px h-12 bg-secondary/20" />
              <div className="w-8 h-8 rounded-full border border-secondary/30 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-secondary/50">
                  <rect x="7" y="0" width="2" height="16" fill="currentColor" />
                  <rect x="0" y="7" width="16" height="2" fill="currentColor" />
                </svg>
              </div>
              <div className="w-px flex-1 bg-secondary/20" />
            </div>
          </div>

          <div className="md:col-span-7 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent hidden md:block" />

            <div className="grid md:grid-cols-2 gap-4 md:pl-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="bg-surface-container-low p-4 md:p-8 rounded-xl md:col-span-2 relative overflow-hidden"
              >
                <Church className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/[0.04] pointer-events-none" />

                <h3 className="font-headline text-2xl text-primary mb-6">
                  The Lord&apos;s Day
                </h3>
                <div>
                  {sundayServices.map((service, i) => (
                    <div
                      key={service.id}
                      className={`flex justify-between items-center py-4 ${
                        i < sundayServices.length - 1
                          ? "border-b border-outline-variant/30"
                          : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-semibold text-on-surface">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <span className="bg-secondary/10 text-secondary-fixed-dim rounded-full text-xs font-bold px-3 py-1 whitespace-nowrap ml-4">
                        {service.time}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {midweekServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-surface-container-highest p-6 rounded-xl flex items-center gap-3 md:gap-6"
                >
                  <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-label font-bold text-on-surface">
                      {midweekServices[0].name}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {midweekServices[0].day} · {midweekServices[0].time}
                    </p>
                  </div>
                </motion.div>
              )}

              {youthServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-surface-container-highest p-6 rounded-xl flex items-center gap-3 md:gap-6"
                >
                  <div className="rounded-lg bg-secondary/10 p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-label font-bold text-on-surface">
                      {youthServices[0].name}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {youthServices[0].day} · {youthServices[0].time}
                    </p>
                  </div>
                </motion.div>
              )}

              {otherServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="bg-surface-container-low p-6 rounded-xl flex items-center gap-6"
                >
                  <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-label font-bold text-on-surface">
                      {service.name}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {service.day} · {service.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}