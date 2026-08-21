"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Sunrise, Church, Flower2 } from "lucide-react";
import { serviceTimes } from "@/data";

const servicePhotos = [
  {
    src: "/images/service times/DAYSPRING HOUR OF REVELATION  DP 2026 3.jpg",
    alt: "Dayspring Hour of Revelation",
  },
  {
    src: "/images/service times/WhatsApp Image 2026-08-19 at 11.19.48.jpeg",
    alt: "Service gathering",
  },
  {
    src: "/images/service times/WhatsApp Image 2026-08-19 at 11.20.09.jpeg",
    alt: "Service gathering",
  },
];

export function ServiceTimesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % servicePhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sundayServices = serviceTimes.filter((s) => s.day === "Sunday");
  const midweekServices = serviceTimes.filter((s) => s.day === "Wednesday");
  const tuesdayServices = serviceTimes.filter((s) => s.day === "Tuesday");
  const otherServices = serviceTimes.filter(
    (s) => !["Sunday", "Wednesday", "Tuesday", "Friday"].includes(s.day)
  );

  return (
    <section id="services" ref={ref} className="py-12 md:py-16 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
            Fellowship With Us
          </span>
          <h2 className="font-headline text-3xl md:text-5xl text-on-surface mt-4 leading-tight">
            Sacred Gatherings &amp; Service Times
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg mt-6 leading-relaxed max-w-3xl">
            We gather throughout the week in various settings — from Sunday worship
            celebrations to Tuesday revelation hours and Wednesday word studies. Come
            and experience the presence of God with us.
          </p>
        </motion.div>

        {/* Service times cards (left) + Gallery (right) side by side */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* LEFT: Service times cards */}
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
                  {sundayServices.map((service) => (
                    <div key={service.id} className="py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-body font-semibold text-on-surface text-lg">
                          {service.name}
                        </p>
                        <span className="bg-secondary/10 text-secondary-fixed-dim rounded-full text-sm font-bold px-4 py-1">
                          {service.time}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {service.description}
                        </p>
                      )}
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

              {tuesdayServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="bg-surface-container-highest p-6 rounded-xl flex items-center gap-3 md:gap-6"
                >
                  <div className="rounded-lg bg-secondary/10 p-3 flex-shrink-0">
                    <Sunrise className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-label font-bold text-on-surface">
                      {tuesdayServices[0].name}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {tuesdayServices[0].day} · {tuesdayServices[0].time}
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
                    {service.id === "jewels" ? (
                      <Flower2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Clock className="w-6 h-6 text-primary" />
                    )}
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

          {/* RIGHT: Auto-rotating gallery (same level as cards) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-outline-variant/30 shadow-sm bg-surface-container-low">
              <button
                type="button"
                onClick={() => setLightbox(currentPhoto)}
                className="absolute inset-0 z-10 cursor-zoom-in"
                aria-label="Enlarge photo"
              />
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto}
                  src={servicePhotos[currentPhoto].src}
                  alt={servicePhotos[currentPhoto].alt}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
                <p className="text-white/90 text-sm font-medium drop-shadow">
                  {servicePhotos[currentPhoto].alt}
                </p>
                <div className="flex gap-1.5">
                  {servicePhotos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPhoto(i)}
                      aria-label={`Show photo ${i + 1}`}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentPhoto ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(null)}
            onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
            role="dialog"
            aria-label="Enlarged photo"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold z-50"
              aria-label="Close"
            >
              &times;
            </button>
            <motion.img
              key={lightbox}
              src={servicePhotos[lightbox].src}
              alt={servicePhotos[lightbox].alt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {servicePhotos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  aria-label={`Show photo ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === lightbox ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
