"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Radio, Calendar, Users } from "lucide-react";

export function LiveStreamSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // In production, this would be fetched from /api/livestream
  // For now, always show offline state
  const isLive = false;

  // Get next service time
  const getNextService = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Simple logic to find next Sunday service
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);

    return {
      name: "Sunday Service",
      date: nextSunday.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: "9:30 AM",
    };
  };

  const nextService = getNextService();

  return (
    <section id="livestream" ref={ref} className="py-28 md:py-36 bg-primary-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 text-accent-400 text-sm font-medium mb-6">
            <Radio className="w-4 h-4" />
            Live Stream
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Join Us Online
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Can&apos;t make it in person? Watch our services live from anywhere in the world.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Live Player Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-primary-900 rounded-3xl overflow-hidden">
            {/* Live Status Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-primary-800">
              <div className="flex items-center gap-3">
                {isLive ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 font-medium">LIVE</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-white/30" />
                    <span className="text-white/60">Offline</span>
                  </>
                )}
              </div>
              <a
                href="https://www.youtube.com/@hisdayspring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm flex items-center gap-1"
              >
                <Users className="w-4 h-4" />
                YouTube
              </a>
            </div>

            {/* Video Area */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {isLive ? (
                <iframe
                  src="https://www.youtube.com/embed/@hisdayspring?autoplay=1"
                  title="Hisdayspring Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-primary-800 flex items-center justify-center mx-auto mb-6">
                    <Radio className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">
                    No Live Service Currently
                  </h3>
                  <p className="text-white/60 mb-6">
                    Our next service will be broadcast live on YouTube
                  </p>
                </div>
              )}
            </div>

            {/* Next Service Info */}
            {!isLive && (
              <div className="p-6 bg-primary-800/50">
                <div className="flex items-center justify-center gap-8 text-center">
                  <div>
                    <Calendar className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                    <div className="text-white font-medium">{nextService.name}</div>
                    <div className="text-white/60 text-sm">{nextService.date}</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div>
                    <Radio className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                    <div className="text-white font-medium">{nextService.time}</div>
                    <div className="text-white/60 text-sm">WATCH ON YOUTUBE</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Facebook Live Alternative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-white/50 text-sm mb-4">Also available on Facebook Live</p>
          <a
            href="https://www.facebook.com/people/Hisdayspring-Evangelical-Ministries-Intl-Dayspring/61563639119953/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Watch on Facebook
          </a>
        </motion.div>
      </div>
    </section>
  );
}
