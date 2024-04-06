import React from "react";
import { HeroHighlight, Highlight } from "./hero/hightlight";
import Hero from "./hero";
import { MacbookScroll } from "./macbook/components";
import Navbar from "./navbar";
import { StickyScroll } from "./features/stickyscroll";
import Features from "./features";

function Index() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />

      <div className="py-[50rem]">q</div>
    </div>
  );
}

export default Index;
