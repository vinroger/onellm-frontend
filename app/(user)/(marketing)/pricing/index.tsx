"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { subscriptionPlans } from "@/constants/stripeLink";
import { cn } from "@/lib/utils";
import { frequencies, tiers } from "@/constants/tierpricing";
import { CanvasRevealEffect } from "./canvasreveal";

const colorsArr = [
  //   [
  //     [59, 130, 246],
  //     [139, 92, 246],
  //   ],
  [],
  [
    [236, 72, 153],
    [232, 121, 249],
  ],
  [[125, 211, 252]],
];

function PricingCard({
  colors,
  features,
  price,
  tierName,
}: {
  colors: number[][];
  features: string[];
  price: string;
  tierName: string;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-[40rem] flex flex-col lg:flex-row overflow-hidden  bg-black w-[20rem]  p-7 relative rounded-lg"
    >
      <div className="flex flex-col min-w-full w-full h-full min-h-full z-10">
        <p className="md:text-xl text-xl font-regular text-neutral-200 relative z-20 max-w-2xl">
          {tierName}
        </p>
        <div className="flex flex-row items-end">
          <p className="md:text-3xl text-3xl font-semibold text-neutral-200  relative z-20 max-w-2xl">
            {price}
          </p>
          {price !== "Contact Us" && (
            <p className="md:text-xl ml-1 text-xl font-regular text-neutral-200  relative z-20 max-w-2xl">
              /mo
            </p>
          )}
        </div>
        <ul className="mt-8 space-y-3 text-sm leading-6 text-neutral-200 xl:mt-10">
          {features.map((feature: any) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon
                className="h-6 w-5 flex-none text-neutral-200"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={colors.length === 0 || !colors ? undefined : colors}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.7]}
              dotSize={5}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Radial gradient for the cute fade */}
      <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/70 dark:bg-black/90" />
    </div>
  );
}

export function PricingPage() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className="flex flex-col min-w-full items-center justify-center py-10 mt-20">
      <p className="font-semibold text-md text-center mt-2 mb-1 text-purple-700">
        PRICING
      </p>

      <p className="text-neutral-700 text-center mb-5 text-md font-semibold">
        Choose the plan that works best for you.
      </p>
      <div className="mb-16 flex justify-center">
        <RadioGroup
          value={frequency}
          defaultValue={frequencies[0]}
          onChange={setFrequency}
          className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
        >
          <RadioGroup.Label className="sr-only">
            Payment frequency
          </RadioGroup.Label>
          {frequencies.map((option: any) => (
            <RadioGroup.Option
              key={option.value}
              value={option}
              className={({ checked }) => {
                return cn(
                  checked ? "bg-neutral-700 text-white" : "text-neutral-500",
                  "cursor-pointer rounded-full px-2.5 py-1"
                );
              }}
            >
              <span>{option.label}</span>
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      <div className="flex flex-row max-w-screen-xl space-x-3">
        {tiers.map((tier, idx) => (
          <PricingCard
            key={tier.id}
            colors={colorsArr[idx]}
            price={(tier.price as any)[frequency.value as any]}
            features={tier.features}
            tierName={tier.name}
          />
        ))}
        {/* <PricingCard
          colors={[
            [59, 130, 246],
            [139, 92, 246],
          ]}
          node={
            <p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto">
              With insomnia, nothing&apos;s real. Everything is far away.
              Everything is a copy, of a copy, of a copy
            </p>
          }
        />
        <PricingCard
          colors={[
            [59, 130, 246],
            [139, 92, 246],
          ]}
          node={<div>Card 1</div>}
        />
        <PricingCard
          colors={[
            [59, 130, 246],
            [139, 92, 246],
          ]}
          node={<div>Card 1</div>}
        /> */}
      </div>
    </div>
  );
}
