"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Play, Camera, Radio } from "lucide-react";
import { socialLinks } from "@/data/social";

const iconMap: Record<string, React.ElementType> = {
  facebook: Globe,
  youtube: Play,
  instagram: Camera,
  twitter: Globe,
  zenofm: Radio,
};

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  twitter: "X / Twitter",
  zenofm: "Radio",
};

export function SocialSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const platformGroups = socialLinks.reduce(
    (acc, link) => {
      if (!acc[link.platform]) {
        acc[link.platform] = [];
      }
      acc[link.platform].push(link);
      return acc;
    },
    {} as Record<string, typeof socialLinks>
  );

  const radioLink = socialLinks.find((l) => l.platform === "zenofm");

  return (
    <section
      id="social"
      ref={ref}
      className="bg-surface-container-low py-12 md:py-20 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.3em] text-secondary font-bold text-xs">
            Connect with Us
          </span>
          <h3 className="font-headline text-2xl md:text-4xl text-on-surface mt-4">
            Beyond the Sanctuary
          </h3>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {Object.entries(platformGroups).map(([platform, links], index) => {
            const Icon = iconMap[platform] || Globe;
            return (
              <motion.a
                key={platform}
                href={links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group flex flex-col items-center gap-4"
              >
                <span className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </span>
                <span className="font-label text-sm font-medium text-on-surface">
                  {platformLabels[platform] || links[0].label}
                </span>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary-container/30 rounded-full text-on-secondary-container">
            <Radio className="w-5 h-5" />
            <span className="font-medium text-sm">
              Listen to Hisdayspring Radio 24/7
            </span>
          </div>
          <div className="mt-6">
            <a
              href={radioLink?.url || "https://zeno.fm/radio/hisdayspringradio/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-bold transition-colors hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Radio className="w-5 h-5" />
              Listen Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
