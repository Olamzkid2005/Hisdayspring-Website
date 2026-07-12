"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { workforce } from "@/data";

const roleColors: Record<string, string> = {
  "lead-pastor": "bg-primary/10 text-on-primary-container",
  "branch-pastor": "bg-secondary/10 text-on-secondary-container",
  minister: "bg-primary/10 text-on-primary-container",
  "head-of-department": "bg-secondary/10 text-on-secondary-container",
};

const roleLabels: Record<string, string> = {
  "lead-pastor": "Lead Pastor",
  "branch-pastor": "Branch Pastor",
  minister: "Minister",
  "head-of-department": "Head of Department",
};

function WorkforceCard({
  member,
  index,
}: {
  member: (typeof workforce)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group"
    >
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index < 2 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Role badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                roleColors[member.role] || "bg-primary/10 text-on-primary-container"
              }`}
            >
              {roleLabels[member.role] || member.role}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 md:p-6">
          <h3 className="font-headline text-xl md:text-2xl text-on-surface group-hover:text-primary transition-colors duration-300">
            {member.name}
          </h3>
          <p className="font-label text-secondary font-bold tracking-widest uppercase text-xs mt-1.5">
            {member.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function WorkforceSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="workforce"
      ref={ref}
      className="py-16 md:py-32 px-6 md:px-12 bg-surface-container-low"
      aria-labelledby="workforce-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end gap-4 md:gap-8 mb-12 md:mb-24"
        >
          <div className="max-w-2xl">
            <h2
              id="workforce-heading"
              className="font-headline text-4xl md:text-5xl text-on-surface"
            >
              Meet Our{" "}
              <em className="text-secondary">Pastors</em>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-outline-variant" />
        </motion.div>

        {/* Lead Pastors — feature in a two-column row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {workforce.slice(0, 2).map((member, index) => (
            <WorkforceCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Remaining pastors — three-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {workforce.slice(2).map((member, index) => (
            <WorkforceCard key={member.id} member={member} index={index + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
