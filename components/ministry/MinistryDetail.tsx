import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Cross,
  Flame,
  Gift,
  GraduationCap,
  HandHeart,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import { ministries } from "@/data/ministries";
import type { Ministry } from "@/types";

const iconMap: Record<string, typeof Users> = {
  Users,
  Compass,
  Heart,
  GraduationCap,
  HandHeart,
  Cross,
  Gift,
  BookOpen,
  Sparkles,
  Flame,
};

export function MinistryDetail({
  ministry,
  backHref = "/#ministries",
  backLabel = "Back to Ministries",
  showDonateCta = false,
}: {
  ministry: Ministry;
  backHref?: string;
  backLabel?: string;
  showDonateCta?: boolean;
}) {
  const Icon = iconMap[ministry.icon ?? ""] ?? Users;
  const otherMinistries = ministries.filter((m) => m.id !== ministry.id);

  return (
    <>
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-zinc-900">
        {ministry.imageUrl && (
          <img
            src={ministry.imageUrl}
            alt={ministry.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            {ministry.founded && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider uppercase">
                Founded {ministry.founded}
              </span>
            )}
          </div>

          <h1 className="font-headline text-4xl md:text-6xl text-white leading-tight max-w-4xl">
            {ministry.name}
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            {ministry.description}
          </p>
        </div>
      </section>

      {ministry.stats && ministry.stats.length > 0 && (
        <section className="bg-surface-container-low border-b border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
            {ministry.stats.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="font-headline text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-3 gap-10 md:gap-14">
          <div className="lg:col-span-2">
            <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
              About This Ministry
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mt-3 mb-6">
              What We&apos;re About
            </h2>
            <div className="space-y-4">
              {(ministry.longDescription ?? ministry.description)
                .split(". ")
                .filter(Boolean)
                .map((sentence, i) => (
                  <p
                    key={i}
                    className="text-on-surface-variant text-base md:text-lg leading-relaxed"
                  >
                    {sentence.trim()}.
                  </p>
                ))}
            </div>
          </div>

          <aside className="space-y-6">
            {ministry.verse && (
              <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
                <span className="font-label text-secondary font-semibold tracking-widest uppercase text-xs">
                  Scripture
                </span>
                <p className="font-headline text-lg md:text-xl text-on-surface italic leading-relaxed mt-3">
                  &ldquo;{ministry.verse.text}&rdquo;
                </p>
                <p className="text-sm font-bold text-secondary mt-3">
                  — {ministry.verse.reference}
                </p>
              </div>
            )}

            {ministry.schedule && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-secondary/10 p-3 flex-shrink-0">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">
                    When We Meet
                  </h3>
                </div>
                <p className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  {ministry.schedule}
                </p>
              </div>
            )}

            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-4">
                Want to Join?
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                We&apos;d love to have you. Reach out to us and our team will
                guide you into this ministry.
              </p>
              <a
                href={`https://wa.me/2348077829444?text=${encodeURIComponent(
                  `Hello, I would like to join the ${ministry.name} ministry at Hisdayspring`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary-container hover:text-on-primary transition-colors"
              >
                Contact Us on WhatsApp
              </a>
              {showDonateCta && (
                <Link
                  href="/giving"
                  className="inline-flex items-center justify-center w-full px-6 py-4 mt-3 bg-secondary text-on-secondary rounded-full font-medium hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
                >
                  Give Online
                </Link>
              )}
              <Link
                href="/#services"
                className="inline-flex items-center justify-center w-full px-6 py-4 mt-3 border border-outline-variant text-on-surface rounded-full font-medium hover:bg-white transition-colors"
              >
                See Service Times
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {ministry.highlights && ministry.highlights.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
              What To Expect
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mt-3 mb-10">
              Highlights of This Ministry
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {ministry.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-surface-container-low rounded-xl p-5"
                >
                  <div className="rounded-lg bg-secondary/10 p-2.5 flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-on-surface font-medium leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {ministry.programs && ministry.programs.length > 0 && (
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
              Learn &amp; Grow
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mt-3 mb-10">
              Programs &amp; Classes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ministry.programs.map((program, i) => (
                <div
                  key={i}
                  className="bg-surface-container-low rounded-2xl p-6 md:p-8 border border-outline-variant/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2.5 flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-bold text-on-surface">
                      {program.name}
                    </h3>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
                    {program.description}
                  </p>
                  {program.topics && program.topics.length > 0 && (
                    <ul className="space-y-2.5">
                      {program.topics.map((topic, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-on-surface">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {ministry.gallery && ministry.gallery.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-label text-secondary font-semibold tracking-widest uppercase text-sm">
                  Moments &amp; Memories
                </span>
                <h2 className="font-headline text-3xl md:text-4xl text-on-surface mt-3">
                  Gallery
                </h2>
              </div>
              <Link
                href="/#gallery"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
              >
                View Full Church Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {ministry.gallery.map((image, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden group ${
                    i === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${ministry.name} — photo ${i + 1}`}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      i === 0 ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[4/3] md:aspect-[4/3]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-10">
            Explore Other Ministries
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMinistries.map((other) => (
              <Link
                key={other.id}
                href={`/ministries/${other.id}`}
                className="group relative h-56 rounded-2xl overflow-hidden"
              >
                {other.imageUrl && (
                  <img
                    src={other.imageUrl}
                    alt={other.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-headline text-lg md:text-xl text-white group-hover:text-secondary-container transition-colors">
                    {other.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
