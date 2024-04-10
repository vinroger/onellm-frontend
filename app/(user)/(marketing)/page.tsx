import React from "react";
import { HeroHighlight, Highlight } from "./hero/hightlight";
import Hero from "./hero";
import { MacbookScroll } from "./macbook/components";
import Navbar from "./navbar";
import { StickyScroll } from "./features/stickyscroll";
import Features from "./features";
import Testimonials from "./testimonials";
import { PricingPage } from "./pricing";
import CTASection from "./cta";
import FAQSection from "./faq";
import Footer from "./footer";

function Index() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <PricingPage />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Index;
