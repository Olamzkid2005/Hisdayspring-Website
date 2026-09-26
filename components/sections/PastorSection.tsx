"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Users, Home } from "lucide-react";
import { ReadMore } from "@/components/ui/ReadMore";

const leadMessage = {
  name: "Pastor Blessing Olamijulo",
  title: "General Overseer and Lead Pastor",
  greeting:
    "Welcome home! We are delighted that you have found your way to Hisdayspring Evangelical Ministries International. Whether you are visiting for the first time or taking a step of faith to make this your church family, we want you to know — you are not just welcome here, you belong here.",
  message:
    "Hisdayspring is more than a church; it is a spiritual home where lives are transformed, destinies are fulfilled, and families are built on the solid foundation of God's Word. Our commission is to raise holy, healthy, and wealthy people who will impact their world with the love and power of Christ. As you journey with us, expect to encounter the presence of God, experience genuine community, and discover your purpose in the Kingdom. This is your house. This is your family. We are honoured to walk with you.",
};

const residentMessage = {
  name: "Pastor (Mrs) Adebamigbe Olamijulo",
  title: "Resident Pastor",
  greeting:
    "It is with great joy that I welcome you to Hisdayspring — a place where you will find love, warmth, and a community that truly cares. From the moment you walk through our doors, you are family. We believe that every person matters to God and to us.",
  message:
    "Whether you are taking your first step in faith or looking for a place to grow and serve, you have found your spiritual home. Here, we raise sons and daughters who know their God and walk in their purpose. I personally assure you that you will be loved, nurtured, and supported every step of the way. Welcome to a family where your story meets God's grace.",
};

export function PastorSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="welcome"
      ref={ref}
      className="py-12 md:py-16 px-6 md:px-12 bg-surface-container-low"
      aria-labelledby="welcome-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end gap-4 md:gap-8 mb-8 md:mb-24"
        >
          <div className="max-w-2xl">
            <h2
              id="welcome-heading"
              className="font-headline text-4xl md:text-5xl text-on-surface"
            >
              Welcome to <em className="text-secondary">Hisdayspring</em>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-outline-variant" />
        </motion.div>

        {/* Content — image + messages */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left — welcoming image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[16/10] md:aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pastors/Lead-Pastors-Olamijulo.jpg"
                alt="Pastor Blessing Olamijulo, General Overseer and Lead Pastor, and Pastor (Mrs) Adebamigbe Olamijulo, Resident Pastor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                // The photo is a 3:2 landscape. The desktop frame matches it
                // exactly so nothing is cropped; the 16:10 mobile frame is a
                // shade wider, which only trims a sliver off the top and
                // bottom. Both faces sit above centre, so a centre crop keeps
                // them whole.
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/90 text-on-primary rounded-full text-sm font-medium backdrop-blur-sm">
                  <Heart className="w-4 h-4" fill="currentColor" />
                  Your New Spiritual Home
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — welcoming messages */}
          <div className="space-y-10 md:space-y-16">
            {/* Lead Pastor */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-label text-primary font-bold tracking-widest uppercase text-xs">
                  From the Lead Pastor
                </span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl text-on-surface mb-1">
                {leadMessage.name}
              </h3>
              <p className="font-label text-secondary font-bold tracking-widest uppercase text-xs mb-4">
                {leadMessage.title}
              </p>
              {/* Both paragraphs collapse as one block on phones: the two
                  letters together ran to ~1650px on a 390px screen. */}
              <ReadMore clamp="line-clamp-6" className="text-on-surface-variant">
                <p className="leading-relaxed">{leadMessage.greeting}</p>
                <p className="leading-relaxed mt-4">{leadMessage.message}</p>
              </ReadMore>
            </motion.div>

            {/* Resident Pastor */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-secondary" />
                <span className="font-label text-secondary font-bold tracking-widest uppercase text-xs">
                  From the Resident Pastor
                </span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl text-on-surface mb-1">
                {residentMessage.name}
              </h3>
              <p className="font-label text-secondary font-bold tracking-widest uppercase text-xs mb-4">
                {residentMessage.title}
              </p>
              <ReadMore clamp="line-clamp-6" className="text-on-surface-variant">
                <p className="leading-relaxed">{residentMessage.greeting}</p>
                <p className="leading-relaxed mt-4">{residentMessage.message}</p>
              </ReadMore>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
