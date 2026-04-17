"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, CalendarPlus } from "lucide-react";
import { upcomingEvents } from "@/data/events";
import type { Event } from "@/types";

function getCategoryBadge(category: Event["category"]) {
  switch (category) {
    case "youth":
      return "bg-secondary-container text-on-secondary-container";
    case "women":
      return "bg-tertiary-container/10 text-tertiary";
    case "special":
      return "bg-secondary-container text-on-secondary-container";
    case "general":
    default:
      return "bg-primary-container/10 text-primary";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

function EventItem({ event, index }: { event: Event; index: number }) {
  const { day, month } = formatDate(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col md:flex-row items-center gap-4 md:gap-8 p-6 bg-surface-container-lowest rounded-2xl hover:bg-white transition-all shadow-sm"
    >
      <div className="flex-none text-center border-b md:border-b-0 md:border-r border-outline-variant pb-4 md:pb-0 md:pr-8 md:min-w-[100px]">
        <div className="text-primary font-bold text-3xl font-headline">{day}</div>
        <div className="text-on-surface-variant uppercase text-xs tracking-widest">{month}</div>
      </div>

      <div className="flex-1 min-w-0">
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mb-2 ${getCategoryBadge(event.category)}`}>
          {event.category}
        </span>
        <h3 className="font-headline text-xl text-on-surface group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
      </div>

      <button
        type="button"
        className="bg-surface-container p-3 rounded-full hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]"
        aria-label="Add to calendar"
      >
        <CalendarPlus className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

export function EventsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" ref={ref} className="bg-surface py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-headline text-2xl md:text-4xl text-on-surface mb-4">Upcoming Events</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Mark your calendar for life-changing conferences, worship nights, and community gatherings.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <EventItem key={event.id} event={event} index={index} />
          ))
        ) : (
          <div className="text-center py-16">
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
              No Upcoming Events
            </h3>
            <p className="text-on-surface-variant">
              Check back soon for upcoming events at Hisdayspring!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}