import { subscriptionPlans } from "./stripeLink";

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
