import Image from "next/image";
import type { Metadata } from "next";
import { GraduationCap, Heart, Users, Church } from "lucide-react";
import { workforce } from "@/data/workforce";
import { BackButton } from "@/components/ui";
import type { WorkforceMember } from "@/types";

export const metadata: Metadata = {
  title: "Meet Our Pastors",
  description:
    "Meet the pastors and ministers of Hisdayspring Ministries International — the lead pastors, branch pastors, and ministers serving across our branches.",
};

const roleSections: {
  role: WorkforceMember["role"];
  title: string;
  subtitle: string;
}[] = [
  {
    role: "lead-pastor",
    title: "Lead Pastors",
    subtitle: "The spiritual oversight of Hisdayspring Ministries International.",
  },
  {
    role: "branch-pastor",
    title: "Branch Pastors",
    subtitle: "Pastoring our branch assemblies across the city.",
  },
  {
    role: "minister",
    title: "Ministers",
    subtitle: "Ministers serving the church across various departments.",
  },
];

function MemberCard({ member }: { member: WorkforceMember }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-headline text-lg md:text-xl text-on-surface">
          {member.name}
        </h3>
        <p className="font-label text-secondary font-bold tracking-widest uppercase text-xs mt-1">
          {member.title}
        </p>
        {(member.branch || member.department) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {member.branch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-on-primary-container text-xs font-semibold">
                <Church className="w-3.5 h-3.5" />
                {member.branch} Branch
              </span>
            )}
            {member.department && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-on-secondary-container text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                {member.department}
              </span>
            )}
          </div>
        )}
        {member.education && member.education.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </p>
            <ul className="space-y-1">
              {member.education.map((edu, i) => (
                <li key={i} className="text-sm text-on-surface-variant">
                  {edu}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(member.spouse || member.children) && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30">
            {member.spouse && (
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" />
                Spouse: <span className="text-on-surface font-medium">{member.spouse}</span>
              </p>
            )}
            {member.children && (
              <p className="text-sm text-on-surface-variant mt-1">
                Children: <span className="text-on-surface font-medium">{member.children}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LeadPastorCard({ member }: { member: WorkforceMember }) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-[4/5] md:aspect-square overflow-hidden bg-surface-container-low">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="font-headline text-2xl md:text-3xl text-white">{member.name}</h3>
          <p className="font-label text-secondary-container font-bold tracking-widest uppercase text-xs mt-1">
            {member.title}
          </p>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {member.education && member.education.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </p>
            <div className="flex flex-wrap gap-2">
              {member.education.map((edu, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-surface-container-low text-sm text-on-surface"
                >
                  {edu}
                </span>
              ))}
            </div>
          </div>
        )}
        {(member.spouse || member.children) && (
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {member.spouse && (
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" />
                Spouse: <span className="text-on-surface font-medium">{member.spouse}</span>
              </p>
            )}
            {member.children && (
              <p className="text-sm text-on-surface-variant">
                Children: <span className="text-on-surface font-medium">{member.children}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PastorsPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-end overflow-hidden bg-surface-container-low">
        <Image
          src="/images/gallery/DSC01528.jpg"
          alt="Hisdayspring pastors"
          fill
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="mb-6">
            <BackButton />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
            Our Leadership
          </span>
          <h1 className="font-headline text-4xl md:text-6xl text-white leading-tight">
            Meet Our Pastors
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            The men and women God has placed over Hisdayspring Ministries
            International — shepherding His people with grace and truth.
          </p>
        </div>
      </section>

      {roleSections.map(({ role, title, subtitle }) => {
        const members = workforce.filter((m) => m.role === role);
        if (members.length === 0) return null;
        return (
          <section
            key={role}
            className={`py-16 md:py-24 ${
              role === "lead-pastor" ? "bg-surface" : "bg-surface-container-low"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-end gap-4 md:gap-8 mb-10 md:mb-14">
                <div className="max-w-2xl">
                  <h2 className="font-headline text-3xl md:text-5xl text-on-surface">
                    {title}
                  </h2>
                  <p className="text-on-surface-variant mt-2">{subtitle}</p>
                </div>
                <div className="hidden md:block flex-1 h-px bg-outline-variant" />
              </div>

              {role === "lead-pastor" ? (
                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                  {members.map((member) => (
                    <LeadPastorCard key={member.id} member={member} />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
