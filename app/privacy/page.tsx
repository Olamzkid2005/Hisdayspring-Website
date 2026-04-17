import type { Metadata } from "next";
import Link from "next/link";
import { privacyPolicy } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Hisdayspring Evangelical Ministries International Privacy Policy - Learn how we protect and handle your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {privacyPolicy.lastUpdated}
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-white rounded-lg shadow-sm p-6 mb-12" aria-label="Table of contents">
          <h2 className="font-serif text-xl font-semibold text-primary-900 mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {privacyPolicy.sections.map((section, index) => (
              <li key={index}>
                <a
                  href={`#section-${index}`}
                  className="text-primary-700 hover:text-primary-900 hover:underline transition-colors"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policy Sections */}
        <div className="space-y-8">
          {privacyPolicy.sections.map((section, index) => (
            <section
              key={index}
              id={`section-${index}`}
              className="bg-white rounded-lg shadow-sm p-8"
              aria-labelledby={`section-title-${index}`}
            >
              <h2
                id={`section-title-${index}`}
                className="font-serif text-2xl font-semibold text-primary-900 mb-4"
              >
                {index + 1}. {section.title}
              </h2>
              <div className="prose prose-lg prose-primary max-w-none text-gray-700 whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our privacy policy?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:hello@hisdayspring.org"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-700 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Get in Touch
</Link>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our privacy policy?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:hello@hisdayspring.org"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-700 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}