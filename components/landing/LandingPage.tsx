"use client";

import { CustomCursor } from "@/components/landing/CustomCursor";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { Dining } from "@/components/landing/Dining";
import { Experience } from "@/components/landing/Experience";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { Gallery } from "@/components/landing/Gallery";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Location } from "@/components/landing/Location";
import { Rooms } from "@/components/landing/Rooms";
import { Services } from "@/components/landing/Services";
import { Testimonials } from "@/components/landing/Testimonials";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useLandingMotion } from "@/hooks/useLandingMotion";

export function LandingPage() {
  useLandingMotion();

  return (
    <>
      <CustomCursor />
      <Header />
      <main id="top">
        <Hero />
        <Rooms />
        <Services />
        <Dining />
        <Gallery />
        <Experience />
        <Testimonials />
        <Location />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
