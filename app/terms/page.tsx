import type { Metadata } from "next";
import { termsOfService } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for using the Hisdayspring Evangelical Ministries International website, including donations, book orders, and payment processing.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-4">
            Terms and Conditions
          </h1>
          <p className="text-on-surface-variant">
            Last updated: {termsOfService.lastUpdated}
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-white rounded-lg shadow-sm p-6 mb-12" aria-label="Table of contents">
          <h2 className="font-serif text-xl font-semibold text-on-surface mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-0.5">
            {termsOfService.sections.map((section, index) => (
              <li key={index}>
                {/* A 21px-tall link fails the 24px minimum tap target, so these
                    rows carry a comfortable hit area on touch screens. */}
                <a
                  href={`#section-${index}`}
                  className="inline-flex min-h-[36px] items-center text-primary transition-colors hover:text-on-surface hover:underline"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policy Sections */}
        <div className="space-y-8">
          {termsOfService.sections.map((section, index) => (
            <section
              key={index}
              id={`section-${index}`}
              className="bg-white rounded-lg shadow-sm p-8"
              aria-labelledby={`section-title-${index}`}
            >
              <h2
                id={`section-title-${index}`}
                className="font-serif text-2xl font-semibold text-on-surface mb-4"
              >
                {index + 1}. {section.title}
              </h2>
              <div className="prose prose-lg prose-primary max-w-none text-on-surface-variant whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
