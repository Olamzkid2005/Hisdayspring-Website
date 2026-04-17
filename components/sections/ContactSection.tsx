"use client";

import { useRef, useId } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useFormValidation } from "@/hooks";
import { contactInfo } from "@/data";

export function ContactSection() {
  const messageId = useId();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormValidation({
    fields: {
      name: { required: true },
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

  return (
    <section id="contact" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            Contact Us
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Have questions or need more information? We&apos;d love to hear from you.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-2xl p-6">
                <Mail className="w-8 h-8 text-accent-500 mb-4" />
                <h3 className="font-bold text-primary-900 mb-2">Email</h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-muted hover:text-accent-600 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="bg-primary-50 rounded-2xl p-6">
                <Phone className="w-8 h-8 text-accent-500 mb-4" />
                <h3 className="font-bold text-primary-900 mb-2">Phone</h3>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="text-muted hover:text-accent-600 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-primary-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-accent-500" />
                <h3 className="font-bold text-primary-900">Our Locations</h3>
              </div>
              <div className="space-y-4">
                {contactInfo.addresses.map((addr) => (
                  <div key={addr.branch}>
                    <span className="font-medium text-accent-600">{addr.branch} Branch</span>
                    <p className="text-muted">{addr.address}, {addr.city}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-primary-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-accent-500" />
                <h3 className="font-bold text-primary-900">Office Hours</h3>
              </div>
              <p className="text-muted">{contactInfo.officeHours || "Monday - Friday: 9:00 AM - 5:00 PM"}</p>
            </div>

            {/* Google Maps Placeholder */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-primary-100">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.3!3d6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJOIDPCsDE4JzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1600000000000!5m2!1sen!2sng`}
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

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-cream rounded-3xl p-8 md:p-10"
          >
            <h3 className="font-serif text-2xl font-bold text-primary-900 mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Your Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="John Doe"
              />
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
              <Input
                label="Subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                error={errors.subject}
                required
                placeholder="How can we help you?"
              />
              <div>
                <label htmlFor={messageId} className="block text-sm font-medium text-foreground mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  minLength={10}
                  placeholder="Your message..."
                  className={`
                    w-full px-4 py-3 rounded-xl border bg-white
                    text-foreground placeholder:text-muted-foreground
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-primary-200 hover:border-primary-300 focus:border-primary-500"
                    }
                  `}
                />
                {errors.message && (
                  <p className="mt-1.5 text-sm text-red-500" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
