import type { Metadata } from "next";
import {
  HeroSection,
  AboutSection,
  PastorSection,
  ServiceTimesSection,
  SermonsSection,
  MinistriesSection,
  EventsSection,
  GallerySection,
  SocialSection,
  ContactSection,
} from "@/components/sections";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <PastorSection />
      <ServiceTimesSection />
      <SermonsSection />
      <MinistriesSection />
      <EventsSection />
      <GallerySection />
      <SocialSection />
      <ContactSection />
    </>
  );
}
