"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { InfiniteMovingCards } from "./infinite-moving-cards";

const items = [
  {
    quote:
      "UImagine uses LLM to generate front-end components for our users. Sometimes, the output's messy and unrenderable. OneLLM.co allows me to train LLM to have structure on those responses. Now our generated code is clean, reducing errors like 80%. Huge time-saver without writing a single line of code.",
    name: "Daniel Kurniadi",
    title: "Founder, UImagine",
  },
  {
    quote:
      "Before OneLLM.co, fine-tuning our smaller customer service model was time consuming. Now we can make datasets, plug in our API key, and boom – our chatbot performance has increased! Customers are happier, and our team has time to innovate.",
    name: "Sarah Nguyen",
    title: "Lead AI Engineer, HelpDesk Inc.",
  },
  {
    quote:
      "I was constantly switching between Notion and spreadsheets to organize my data, and do all the tedious coding to integrate my system w/ OpenAI, LLaMa in GCP etc. Now, everything is SO MUCH easier and integrated in one place. THX ONELLM ILY ❤️",
    name: "Chris Lee",
    title: "Founder and CTO, Stealth Startup",
  },
  {
    quote:
      "thx - u save me a lot of time that would have been wasted to try diff models and apis - highly recommend 🙏",
    name: "Alex Patel",
    title: "Freelance Software Engineer",
  },
  {
    quote:
      "We wanted to incorporate LLMs into our product, but our developers and non-technical team members were always on different pages.  OneLLM.co's no-code interface has become a bridge, letting everyone  contribute to building and testing our models",
    name: "Maya Singh",
    title: "Product Manager, InnovateLabs",
  },
  {
    quote:
      "Honestly, I was hesitant about fine-tuning my own LLM models. Seemed too complex... but OneLLM.co makes it surprisingly simple. Now, I can experiment with different datasets and API providers quickly.",
    name: "Olivia Zhang",
    title: "Independent AI Researcher",
  },
];

function Testimonials() {
  return (
    <div className="flex flex-col min-w-full justify-center items-center py-10 mt-20">
      <p className="font-semibold text-md text-center mt-2 mb-1 text-purple-700">
        TESTIMONIALS
      </p>

      <p className="text-neutral-700 text-center mb-5 text-md font-semibold">
        We might be young but hear what our users have to say.
      </p>
      {/* <div className="h-[0.15rem] w-1/4 self-center bg-faded-gradient" /> */}
      <Separator
        orientation="horizontal"
        className="w-[200px] mx-auto text-center mb-10 p-[1px]"
      />
      <InfiniteMovingCards items={items} speed="slow" />
    </div>
  );
}

export default Testimonials;
