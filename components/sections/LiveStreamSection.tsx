"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Calendar, Clock } from "lucide-react";
import type { LiveStreamStatus } from "@/types";

export function LiveStreamSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [liveStatus, setLiveStatus] = useState<LiveStreamStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveStatus() {
      try {
        const response = await fetch("/api/livestream");
        if (response.ok) {
          const data = await response.json();
          setLiveStatus(data);
        }
      } catch {
        setLiveStatus({ isLive: false });
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNextService = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);

    return {
      name: "Sunday Glory Service",
      date: nextSunday.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: "9:30 AM",
    };
  };

  const nextService = getNextService();
  const isLive = liveStatus?.isLive ?? false;

  return (
    <section id="livestream" ref={ref} className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-xl overflow-hidden bg-surface-container shadow-2xl"
      >
        <div className="aspect-video w-full bg-zinc-900 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : isLive && liveStatus?.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${liveStatus.videoId}?autoplay=1`}
              title={liveStatus.title || "Hisdayspring Live Stream"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full absolute inset-0"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80')" }}
              />
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full font-bold tracking-widest text-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="https://www.youtube.com/@hisdayspring"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center text-white hover:scale-105 transition-transform"
                >
                  <Play className="w-7 h-7 md:w-10 md:h-10 fill-white" />
                </a>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="font-headline text-xl md:text-3xl text-white">Sunday Glory Service</h2>
                <p className="text-zinc-300">Join us live every Sunday for powerful worship and the Word</p>
              </div>
            </>
          )}
        </div>

        {!isLive && !isLoading && (
          <div className="p-6 bg-surface-container">
            <div className="flex items-center justify-center gap-4 md:gap-8 text-center">
              <div>
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-on-surface">{nextService.name}</div>
                <div className="text-on-surface-variant text-sm">{nextService.date}</div>
              </div>
              <div className="w-px h-12 bg-outline-variant" />
              <div>
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-on-surface">{nextService.time}</div>
                <div className="text-on-surface-variant text-sm">WATCH ON YOUTUBE</div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <a
                href="https://www.youtube.com/@hisdayspring"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm transition-colors"
              >
                <Play className="w-5 h-5 fill-white" />
                Subscribe on YouTube
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}