"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, Clock, Star } from "lucide-react";
import { upcomingEvents } from "@/data/events";
import type { Event } from "@/types";

function EventCard({ event, index }: { event: Event; index: number }) {
  const eventDate = new Date(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image/Date Badge */}
      <div className="relative p-6 bg-primary-900 text-white">
        {event.isFeatured && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-accent-500 text-primary-900 text-xs font-bold rounded-full">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="text-center">
          <div className="text-accent-400 text-sm font-medium uppercase tracking-wider">
            {eventDate.toLocaleDateString("en-US", { month: "short" })}
          </div>
          <div className="text-5xl font-bold font-serif">{eventDate.getDate()}</div>
          <div className="text-white/60 text-sm">{eventDate.getFullYear()}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full mb-3 capitalize">
          {event.category.replace("-", " ")}
        </span>
        <h3 className="font-serif text-xl font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-muted text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-muted/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EventsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Join Us at Our Events
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Mark your calendar for life-changing conferences, worship nights, and community
            gatherings.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Events Grid */}
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-primary-50 rounded-3xl">
            <Calendar className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
              No Upcoming Events
            </h3>
            <p className="text-muted">
              Check back soon for upcoming events at Hisdayspring!
            </p>
          </div>
        )}

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted mb-6">Don&apos;t miss out on our events</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-primary-900 rounded-full font-medium hover:bg-accent-600 transition-colors"
          >
            Subscribe to Our Newsletter
          </a>
        </motion.div>
      </div>
    </section>
  );
}
