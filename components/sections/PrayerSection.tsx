"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useFormValidation } from "@/hooks";
import { config } from "@/lib/config";

export function PrayerSection() {
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
      prayerRequest: { required: true, minLength: 10 },
    },
    onSubmit: async (values) => {
      const phone = config.whatsappNumber.replace(/\s/g, "").replace("+", "");
      const message = `Prayer Request from ${values.name} (${values.email}):%0A%0A${encodeURIComponent(values.prayerRequest)}`;
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      resetForm();
    },
  });

  return (
    <section id="prayer" ref={ref} className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-16 relative overflow-hidden" style={{ boxShadow: "0 24px 48px -12px rgba(184, 0, 53, 0.06)" }}>
        {/* Background image — subtle watermark style */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/gallery/DSC_5073.jpg"
            alt=""
            fill
            sizes="100vw"
            className="w-full h-full object-cover opacity-50"
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <Heart
            className="text-primary w-12 h-12 mx-auto mb-6"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
          <h2 className="font-headline text-2xl md:text-4xl text-on-surface">
            How can we pray for you?
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto mt-4">
            Share your prayer request and our team will stand with you in faith. Your request will open in WhatsApp for you to send directly to our prayer team; please avoid sharing highly sensitive information.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Input
            label="Your Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="John Doe"
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none p-4 rounded-lg"
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
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none p-4 rounded-lg"
          />
          <div className="md:col-span-2">
            <label htmlFor="prayer-request" className="block text-sm font-medium mb-1.5 text-on-surface">
              Prayer Request <span className="text-primary">*</span>
            </label>
            <textarea
              id="prayer-request"
              name="prayerRequest"
              value={values.prayerRequest}
              onChange={handleChange}
              rows={4}
              required
              minLength={10}
              placeholder="Share your prayer request with us..."
              className={`w-full bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none p-4 rounded-lg ${errors.prayerRequest ? "border-error focus:border-error" : ""}`}
            />
            {errors.prayerRequest && (
              <p className="mt-1.5 text-sm text-error" role="alert">
                {errors.prayerRequest}
              </p>
            )}
          </div>
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-primary text-on-primary px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg shadow-primary/20"
            >
              Submit Prayer Request
            </Button>
            <p className="text-sm text-on-surface-variant">
              WhatsApp will open with your request prepared. This website does not store or send prayer requests, so please do not include highly sensitive information.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
