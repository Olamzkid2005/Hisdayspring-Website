"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useFormValidation } from "@/hooks";
import { contactInfo } from "@/data/contact";

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation({
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true, email: true },
      subject: { required: true },
      message: { required: true, minLength: 10 },
    },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Contact form submitted:", values);
      alert("Thank you for your message! We'll get back to you soon.");
      resetForm();
    },
  });

  const firstAddress = contactInfo.addresses[0];

  return (
    <section id="contact" ref={ref} className="py-16 md:py-24 bg-surface text-on-surface">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-3xl md:text-5xl text-primary mb-8 md:mb-12">
            Get in Touch
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <span className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <MapPin className="w-6 h-6" />
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

            <div className="flex gap-6">
              <span className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <Phone className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Office Line</h3>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="text-on-surface-variant mt-1 block hover:text-primary transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-6">
              <span className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0">
                <Mail className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Email Support</h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-on-surface-variant mt-1 block hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 h-64 w-full bg-surface-container-high rounded-3xl overflow-hidden grayscale">
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
          className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/10"
        >
          <h3 className="font-headline text-2xl text-on-surface mb-8">
            Send us a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                placeholder="John"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="john@example.com"
            />
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5 text-on-surface">
                Subject <span className="text-primary">*</span>
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={values.subject}
                onChange={(e) => setFieldValue("subject", e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-xl border bg-surface-container-low text-on-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.subject ? "border-red-500 focus:ring-red-500" : "border-outline-variant hover:border-outline focus:border-primary"}`}
              >
                <option value="">Inquiry Topic</option>
                <option value="membership">Membership</option>
                <option value="ministries">Ministries</option>
                <option value="technical-support">Technical Support</option>
                <option value="other">Other</option>
              </select>
              {errors.subject && (
                <p className="mt-1.5 text-sm text-red-500" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-on-surface">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={values.message}
                onChange={handleChange}
                rows={5}
                required
                minLength={10}
                placeholder="Your message..."
                className={`w-full px-4 py-3 rounded-xl border bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.message ? "border-red-500 focus:ring-red-500" : "border-outline-variant hover:border-outline focus:border-primary"}`}
              />
              {errors.message && (
                <p className="mt-1.5 text-sm text-red-500" role="alert">
                  {errors.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-secondary text-on-secondary py-4 rounded-full font-bold"
            >
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
