"use client";

import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { customerPortalUrl, subscriptionPlans } from "@/constants/stripeLink";
import { useUser } from "@clerk/nextjs";
import { useAppSelector } from "@/store";
import ShimmerButton from "@/components/aceternity/shimmerbutton";

export const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];
export const tiers = [
  {
    name: "Free",
    id: "free",

    price: { monthly: "$0", annually: "$0" },
    description: "For individuals to build a small project or MVP.",
    features: [
      "1 project",
      "Up to 1 user per project",
      "10,000 logs per month",
      "48-hour support response time",
    ],
    mostPopular: false,
    showPriceSuffix: true,
  },
  {
    name: "Pro",
    id: "pro_plan",
    href: {
      monthly: subscriptionPlans[process.env.NODE_ENV!].pro.monthly,
      annually: subscriptionPlans[process.env.NODE_ENV!].pro.yearly,
    },
    price: { monthly: "$19", annually: "$180" },
    description: "For small teams to build and grow their projects.",
    features: [
      "3 days free-trial cancel anytime",
      "Unlimited projects",
      "Up to 10 users per project",
      "Unlimited logs",
      "24-hour support response time",
      "Biweekly vote for feature requests to our team",
    ],
    mostPopular: true,
    showPriceSuffix: true,
  },
  {
    name: "Enterprise",
    id: "enterprise_plan",
    href: "#",
    price: { monthly: "Contact Us", annually: "Contact Us" },
    description: "Custom solutions for large teams and businesses.",
    features: [
      "Custom features and integrations",
      "Unlimited users",
      "Priority support",
      "HIPAA and SOC 2 compliance",
      "Support LLaMa 2, Gemini, Mistral, and more models",
    ],
    contactUs: true,
    mostPopular: false,
    showPriceSuffix: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const { user } = useUser();

  const oneLLMUser = useAppSelector((state) => state.user);

  const isTierOwned = (tier: any) => {
    if (!oneLLMUser.subscriptionPlan) return tier.id === "free";
    return oneLLMUser.subscriptionPlan.startsWith(tier.id);
  };

  const buildURL = (url: string) => {
    const params = new URLSearchParams({
      prefilled_email: String(primaryEmailAddress) ?? "",
      client_reference_id: id,
    });

    return `${url}?${params.toString()}`;
  };

  if (!user) return null;
  const { primaryEmailAddress, id } = user;

  return (
    <div className="bg-white ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* <h2 className="text-base font-semibold leading-7 text-neutral-600">
            Pricing
          </h2> */}
          {/* <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your Plan
          </p> */}
        </div>
        {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p> */}

        <div className="mt-16 flex justify-center">
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
                  return classNames(
                    checked ? "bg-neutral-600 text-white" : "text-gray-500",
                    "cursor-pointer rounded-full px-2.5 py-1"
                  );
                }}
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 relative">
          {tiers.map((tier: any) => (
            <div
              key={tier.id}
              className={classNames(
                isTierOwned(tier)
                  ? "ring-2 ring-neutral-600"
                  : "ring-1 ring-gray-200",
                "rounded-3xl pb-8 pl-8 pr-8 "
              )}
            >
              <div className="w-full flex justify-center items-center">
                {isTierOwned(tier) ? (
                  <div className=" p-1 mb-4 bg-neutral-700 w-1/2 justify-center items-center flex rounded-b-lg text-white text-sm">
                    Current Plan
                  </div>
                ) : (
                  <div className="m-5" />
                )}
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? "text-neutral-600" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-neutral-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-neutral-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              {/* <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p> */}
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {tier.price[frequency.value]}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  {tier.showPriceSuffix && frequency.priceSuffix}
                </span>
              </p>
              {tier &&
                tier.href &&
                tier.href[frequency.value] &&
                !isTierOwned(tier) && (
                  <a
                    href={buildURL(tier.href[frequency.value])}
                    target="_blank"
                    aria-describedby={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? "bg-neutral-600 text-white shadow-sm hover:bg-neutral-500"
                        : "text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:ring-neutral-300",
                      "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                    )}
                  >
                    {!tier.contactUs ? "Start FREE trial" : "Book a meeting"}
                  </a>
                )}
              {isTierOwned(tier) && tier.id !== "free" && (
                <ShimmerButton
                  className="h-8 mt-8 text-neutral-300"
                  onClick={() => {
                    window.open(
                      customerPortalUrl[process.env.NODE_ENV!],
                      "_blank"
                    );
                  }}
                >
                  Manage My Subscription ↗
                </ShimmerButton>
              )}
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                {tier.features.map((feature: any) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-neutral-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
