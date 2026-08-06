"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Clock, CalendarPlus, X, Expand } from "lucide-react";
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

function formatDate(event: Event) {
  const sessions = event.dates && event.dates.length > 0 ? event.dates : null;
  if (sessions && sessions.length > 1) {
    const first = new Date(sessions[0].date);
    const last = new Date(sessions[sessions.length - 1].date);
    return {
      day: `${first.getDate()}–${last.getDate()}`,
      month: first.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      sessions: sessions.map((s) => ({
        ...s,
        weekday: new Date(s.date).toLocaleDateString("en-US", { weekday: "short" }),
      })),
    };
  }
  const d = new Date(event.date);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    sessions: null,
  };
}

function EventItem({
  event,
  index,
  onImageClick,
}: {
  event: Event;
  index: number;
  onImageClick: (event: Event) => void;
}) {
  const { day, month, sessions } = formatDate(event);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col md:flex-row items-center gap-4 md:gap-8 p-6 bg-surface-container-lowest rounded-2xl hover:bg-white transition-all shadow-sm"
    >
      {event.imageUrl && (
        <button
          type="button"
          onClick={() => onImageClick(event)}
          aria-label={`Enlarge image of ${event.title}`}
          className="relative flex-none rounded-2xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-zoom-in"
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            className="w-24 h-24 md:w-28 md:h-28 object-cover shadow-sm"
          />
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Expand className="w-6 h-6 text-white" />
          </span>
        </button>
      )}

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
        <div className="flex flex-col gap-1 mt-2 text-sm text-on-surface-variant">
          {sessions ? (
            sessions.map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-on-surface">{s.weekday}</span>
                <span>{s.time}</span>
              </span>
            ))
          ) : (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </span>
          )}
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
  const [lightboxEvent, setLightboxEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!lightboxEvent) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxEvent(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxEvent]);

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
            <EventItem
              key={event.id}
              event={event}
              index={index}
              onImageClick={setLightboxEvent}
            />
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

      <AnimatePresence>
        {lightboxEvent && lightboxEvent.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxEvent(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxEvent.title}
          >
            <button
              type="button"
              onClick={() => setLightboxEvent(null)}
              aria-label="Close image"
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              src={lightboxEvent.imageUrl}
              alt={lightboxEvent.title}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {lightboxEvent.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
