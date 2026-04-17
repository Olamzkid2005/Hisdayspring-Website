"use client";

import { useRef, useId } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Mail, Phone } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useFormValidation } from "@/hooks";

export function PrayerSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prayerRequestId = useId();

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
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Prayer request submitted:", values);
      alert("Thank you for your prayer request. Our prayer team will pray for you.");
      resetForm();
    },
  });

  return (
    <section id="prayer" ref={ref} className="py-28 md:py-36 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Prayer Request
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
              We&apos;re Praying With You
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Whatever you&apos;re going through, God cares for you and so do we. Share your
              prayer request with us and our prayer team will stand with you in faith.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 mb-1">Email Us</h3>
                  <p className="text-muted">hello@hisdayspring.org</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 mb-1">Call Us</h3>
                  <p className="text-muted">+234 906 619 2155</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-lg"
          >
            <h3 className="font-serif text-2xl font-bold text-primary-900 mb-6">
              Submit Your Prayer Request
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
              <div>
                <label htmlFor={prayerRequestId} className="block text-sm font-medium text-foreground mb-1.5">
                  Prayer Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={prayerRequestId}
                  name="prayerRequest"
                  value={values.prayerRequest}
                  onChange={handleChange}
                  rows={5}
                  required
                  minLength={10}
                  placeholder="Share your prayer request with us..."
                  className={`
                    w-full px-4 py-3 rounded-xl border bg-white
                    text-foreground placeholder:text-muted-foreground
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${errors.prayerRequest
                      ? "border-red-500 focus:ring-red-500"
                      : "border-primary-200 hover:border-primary-300 focus:border-primary-500"
                    }
                  `}
                />
                {errors.prayerRequest && (
                  <p className="mt-1.5 text-sm text-red-500" role="alert">
                    {errors.prayerRequest}
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
                Submit Prayer Request
              </Button>
              <p className="text-center text-sm text-muted">
                All submissions are confidential and treated with respect.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
