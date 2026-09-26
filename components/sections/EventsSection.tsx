"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Clock, CalendarPlus, X, Expand, Check } from "lucide-react";
import { getUpcomingEvents } from "@/data/events";
import { ReadMore } from "@/components/ui/ReadMore";
import { formatEventDate } from "@/lib/event-dates";
import { downloadEventIcs } from "@/lib/calendar";
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

function EventItem({
  event,
  index,
  onImageClick,
}: {
  event: Event;
  index: number;
  onImageClick: (event: Event) => void;
}) {
  const { day, month, sessions } = formatEventDate(event);
  const [added, setAdded] = useState(false);

  const addToCalendar = () => {
    downloadEventIcs(event);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Several sessions sharing one time collapse into a single short line
  // ("Sun & Sat · 7:00 PM nightly") so phone cards stay the same height,
  // instead of repeating a clock icon once per session.
  const sessionTimes = sessions ? [...new Set(sessions.map((s) => s.time))] : [];
  const mobileTime =
    sessions && sessions.length > 0
      ? sessionTimes.length === 1
        ? `${sessions.map((s) => s.weekday).join(" & ")} · ${sessionTimes[0]}`
        : sessions.map((s) => `${s.weekday} ${s.time}`).join(" · ")
      : event.time;

  const calendarButton = (
    <button
      type="button"
      onClick={addToCalendar}
      className="shrink-0 bg-surface-container p-3 rounded-full hover:bg-primary hover:text-white transition-all min-w-[44px] min-h-[44px]"
      aria-label={`Add ${event.title} to calendar`}
    >
      {added ? (
        <Check className="w-5 h-5 text-primary" aria-hidden="true" />
      ) : (
        <CalendarPlus className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      // Phones get two tidy rows — media + details, then a time/calendar strip
      // — so every card is built the same way. Desktop keeps one wide row.
      className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-8 p-4 md:p-6 bg-surface-container-lowest rounded-2xl transition-all shadow-sm"
    >
      {/* `md:contents` dissolves this wrapper on desktop, so the thumbnail,
          date block and details become direct children of the desktop row
          exactly as before. */}
      <div className="flex items-start gap-3 md:contents">
        {event.imageUrl && (
          <button
            type="button"
            onClick={() => onImageClick(event)}
            aria-label={`Enlarge image of ${event.title}`}
            className="relative flex-none rounded-2xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-zoom-in"
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={112}
              height={112}
              className="w-[72px] h-[72px] md:w-28 md:h-28 object-cover shadow-sm"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Expand className="w-6 h-6 text-white" />
            </span>
          </button>
        )}

        {/* The big date block is desktop-only; on a phone the date rides inline
            with the category pill instead of pushing the card taller. */}
        <div className="hidden md:block flex-none text-center md:border-r border-outline-variant md:pr-8 md:min-w-[100px]">
          <div className="text-primary font-bold text-3xl font-headline">{day}</div>
          <div className="text-on-surface-variant uppercase text-xs tracking-widest">{month}</div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Date and category share one line, so every card starts identically. */}
          <div className="mb-1 flex items-center gap-2 md:mb-2">
            <span className="whitespace-nowrap text-sm font-bold text-primary md:hidden">
              {day} {month}
            </span>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-bold uppercase ${getCategoryBadge(event.category)}`}>
              {event.category}
            </span>
          </div>
          {/* Capped at two lines so a long title can't stretch one card. */}
          <h3 className="font-headline text-base md:text-xl text-on-surface line-clamp-2 md:line-clamp-none group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="hidden md:flex flex-col gap-1 mt-2 text-sm text-on-surface-variant">
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
      </div>

      {/* Phone footer: time on the left, calendar on the right — the same strip
          on every card. */}
      <div className="flex items-center justify-between gap-3 border-t border-outline-variant/40 pt-3 md:hidden">
        <span className="flex min-w-0 items-center gap-2 text-sm text-on-surface-variant">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="line-clamp-2">{mobileTime}</span>
        </span>
        {calendarButton}
      </div>
      <div className="hidden md:block">{calendarButton}</div>
    </motion.div>
  );
}

export function EventsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxEvent, setLightboxEvent] = useState<Event | null>(null);
  const upcomingEvents = getUpcomingEvents();

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
    <section id="events" ref={ref} className="bg-surface py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 md:mb-10"
      >
        <h2 className="font-headline text-2xl md:text-4xl text-on-surface mb-3 md:mb-4">Upcoming Events</h2>
        <ReadMore
          clamp="line-clamp-2"
          className="max-w-2xl mx-auto"
          textClassName="text-on-surface-variant"
          text="Mark your calendar for life-changing conferences, worship nights, and community gatherings."
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-3 md:space-y-6">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <EventItem key={event.id} event={event} index={index} onImageClick={setLightboxEvent} />
          ))
        ) : (
          <div className="text-center py-16">
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Upcoming Events</h3>
            <p className="text-on-surface-variant">Check back soon for upcoming events at Hisdayspring!</p>
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
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white bg-surface-container-lowest/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxEvent.imageUrl}
                alt={lightboxEvent.title}
                fill
                sizes="100vw"
                className="rounded-2xl shadow-2xl object-contain"
              />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {lightboxEvent.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
