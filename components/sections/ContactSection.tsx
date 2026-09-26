"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useFormValidation } from "@/hooks";
import { contactInfo } from "@/data/contact";
import { config } from "@/lib/config";

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactForm = useFormValidation({
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true, email: true },
      subject: { required: true },
      message: { required: true, minLength: 10 },
    },
    onSubmit: async (values) => {
      const subject = encodeURIComponent(`${values.subject} — Hisdayspring website`);
      const body = encodeURIComponent(
        `Name: ${values.firstName} ${values.lastName}\nEmail: ${values.email}\n\n${values.message}`
      );
      window.location.assign(`mailto:${contactInfo.email}?subject=${subject}&body=${body}`);
      contactForm.resetForm();
    },
  });

  const prayerForm = useFormValidation({
    fields: {
      name: { required: true },
      email: { required: true, email: true },
      prayerRequest: { required: true, minLength: 10 },
    },
    onSubmit: async (values) => {
      const phone = config.whatsappNumber.replace(/\s/g, "").replace("+", "");
      const message = encodeURIComponent(
        `Prayer Request from ${values.name} (${values.email}):\n\n${values.prayerRequest}`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
      prayerForm.resetForm();
    },
  });

  const firstAddress = contactInfo.addresses[0];

  return (
    <section id="contact" ref={ref} className="py-10 md:py-16 bg-surface text-on-surface">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-2xl md:text-4xl text-primary mb-5 md:mb-8">
            Get in Touch
          </h2>

          <div className="space-y-6 md:space-y-8">
            <div className="flex gap-4 md:gap-6">
              <span className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Main Sanctuary</h3>
                <p className="text-on-surface-variant mt-1">
                  {firstAddress
                    ? `${firstAddress.address}, ${firstAddress.city}, ${firstAddress.state}, ${firstAddress.country}`
                    : "Lagos, Nigeria"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6">
              <span className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Office Lines</h3>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="flex min-h-[44px] items-center text-on-surface-variant hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
                {contactInfo.phoneAlt && (
                  <a href={`tel:${contactInfo.phoneAlt.replace(/\s/g, "")}`} className="flex min-h-[44px] items-center text-on-surface-variant hover:text-primary transition-colors">
                    {contactInfo.phoneAlt}
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-4 md:gap-6">
              <span className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <Mail className="w-5 h-5 md:w-6 md:h-6" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Email Support</h3>
                <a href={`mailto:${contactInfo.email}`} className="flex min-h-[44px] items-center text-on-surface-variant hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* The embed is a heavy iframe and ~400px tall, which is a lot of a
              phone screen for a map nobody scrolls. Mobile gets a one-tap
              link; the embed returns from md up. */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              firstAddress
                ? `${firstAddress.address}, ${firstAddress.city}`
                : "Hisdayspring Church, Ipaja, Lagos"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden mt-6 inline-flex min-h-[44px] items-center gap-2 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-medium hover:bg-surface-container-low transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Open in Google Maps
          </a>
          <div className="hidden md:block mt-8 md:mt-10 h-48 md:h-56 w-full bg-surface-container-high rounded-3xl overflow-hidden grayscale">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.3!3d6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJOIDPCsDE4JzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1600000000000!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hisdayspring Location"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h3 className="font-headline text-2xl text-on-surface mb-5 md:mb-8">Send us a Message</h3>
          <form onSubmit={contactForm.handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <Input label="First Name" name="firstName" value={contactForm.values.firstName} onChange={contactForm.handleChange} error={contactForm.errors.firstName} required placeholder="John" />
              <Input label="Last Name" name="lastName" value={contactForm.values.lastName} onChange={contactForm.handleChange} error={contactForm.errors.lastName} required placeholder="Doe" />
            </div>
            <Input label="Email Address" name="email" type="email" value={contactForm.values.email} onChange={contactForm.handleChange} error={contactForm.errors.email} required placeholder="john@example.com" />
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5 text-on-surface">Subject <span className="text-primary">*</span></label>
              <select id="contact-subject" name="subject" value={contactForm.values.subject} onChange={(e) => contactForm.setFieldValue("subject", e.target.value)} required aria-invalid={contactForm.errors.subject ? "true" : undefined} aria-describedby={contactForm.errors.subject ? "contact-subject-error" : undefined} className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-on-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${contactForm.errors.subject ? "border-error focus:ring-error" : "border-outline-variant hover:border-outline focus:border-primary"}`}>
                <option value="">Inquiry Topic</option>
                <option value="membership">Membership</option>
                <option value="ministries">Ministries</option>
                <option value="technical-support">Technical Support</option>
                <option value="other">Other</option>
              </select>
              {contactForm.errors.subject && <p id="contact-subject-error" className="mt-1.5 text-sm text-error" role="alert">{contactForm.errors.subject}</p>}
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-on-surface">Message <span className="text-primary">*</span></label>
              <textarea id="contact-message" name="message" value={contactForm.values.message} onChange={contactForm.handleChange} rows={5} required minLength={10} aria-invalid={contactForm.errors.message ? "true" : undefined} aria-describedby={contactForm.errors.message ? "contact-message-error" : undefined} placeholder="Your message..." className={`w-full px-4 py-3 rounded-xl border bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${contactForm.errors.message ? "border-error focus:ring-error" : "border-outline-variant hover:border-outline focus:border-primary"}`} />
              {contactForm.errors.message && <p id="contact-message-error" className="mt-1.5 text-sm text-error" role="alert">{contactForm.errors.message}</p>}
            </div>
            <Button type="submit" isLoading={contactForm.isSubmitting} className="w-full bg-secondary text-on-secondary py-4 rounded-full font-bold">Send Message</Button>
          </form>
          <p className="text-xs text-on-surface-variant">Your email app will open with the message prepared for {contactInfo.email}. No message is sent by this website.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/10"
        >
          <div className="flex items-start gap-3 mb-4 md:mb-6">
            {/* shrink-0 matters: without it the flex row squeezed this 40px
                circle into a narrow oval beside the long paragraph. */}
            <span className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center"><Heart className="w-5 h-5 text-primary" /></span>
            <div>
              <h3 className="font-headline text-xl text-on-surface">How can we pray for you?</h3>
              <p className="text-sm text-on-surface-variant">This opens WhatsApp so you can send your request directly to our prayer team. Please avoid sharing highly sensitive information.</p>
            </div>
          </div>
          {/* Two full forms on one phone screen is a lot of scrolling, and the
              dedicated /prayer page already carries the full request form. */}
          <Link
            href="/prayer"
            className="md:hidden inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-body font-bold text-on-primary transition-colors hover:bg-primary/90"
          >
            <Heart className="w-4 h-4" />
            Send a prayer request
          </Link>
          <form onSubmit={prayerForm.handleSubmit} className="hidden md:block space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Your Name" name="name" value={prayerForm.values.name} onChange={prayerForm.handleChange} error={prayerForm.errors.name} required placeholder="John Doe" />
              <Input label="Email Address" name="email" type="email" value={prayerForm.values.email} onChange={prayerForm.handleChange} error={prayerForm.errors.email} required placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="prayer-request" className="block text-sm font-medium mb-1.5 text-on-surface">Prayer Request <span className="text-primary">*</span></label>
              <textarea id="prayer-request" name="prayerRequest" value={prayerForm.values.prayerRequest} onChange={prayerForm.handleChange} rows={3} required minLength={10} aria-invalid={prayerForm.errors.prayerRequest ? "true" : undefined} aria-describedby={prayerForm.errors.prayerRequest ? "prayer-request-error" : undefined} placeholder="Share your prayer request with us..." className={`w-full px-4 py-3 rounded-xl border bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${prayerForm.errors.prayerRequest ? "border-error focus:ring-error" : "border-outline-variant hover:border-outline focus:border-primary"}`} />
              {prayerForm.errors.prayerRequest && <p id="prayer-request-error" className="mt-1.5 text-sm text-error" role="alert">{prayerForm.errors.prayerRequest}</p>}
            </div>
            <Button type="submit" isLoading={prayerForm.isSubmitting} className="w-full bg-primary text-on-primary py-4 rounded-full font-bold">Submit Prayer Request</Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
