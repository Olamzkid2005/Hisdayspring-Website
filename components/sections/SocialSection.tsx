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
      className="bg-surface-container-low py-10 md:py-14 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-5">
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
                className="group flex flex-col items-center gap-2"
              >
                <span className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-label text-xs font-medium text-on-surface">
                  {platformLabels[platform] || links[0].label}
                </span>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/30 rounded-full text-on-secondary-container text-sm font-medium">
            <Radio className="w-4 h-4" />
            Listen to Hisdayspring Radio 24/7
          </span>
          <a
            href={radioLink?.url || "https://zeno.fm/radio/hisdayspringradio/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-full font-semibold text-sm transition-colors hover:bg-primary/90"
          >
            <Radio className="w-4 h-4" />
            Listen Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
