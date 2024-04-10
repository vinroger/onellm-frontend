"use client";

import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What does OneLLM.co do?",
    answer:
      "OneLLM.co lets anyone fine-tune and evaluate language models without needing to code. Create datasets, fine-tune models with OpenAI or Google API keys, and evaluate model performance easily.",
  },
  {
    question: "How do I make a dataset?",
    answer:
      "Create your dataset with our no-code editor or upload one via a CSV file. It's simple and straightforward.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Nope! Our platform is designed for everyone, coding skills or not. Everything you need to work with language models is at your fingertips.",
  },
  {
    question: "What's fine-tuning?",
    answer:
      "Fine-tuning modifies an existing language model to better suit your needs with your own dataset. Just enter an API key, and we do the rest.",
  },
  {
    question: "Can I see how my model improved?",
    answer:
      "Yes, you can compare your model's performance against the original and see the improvements directly on our platform.",
  },
  {
    question: "Is this suitable for my business?",
    answer:
      "Absolutely. If you're looking to enhance customer service, tailor LLM to create unique content, or more, OneLLM.co is here to help.",
  },

  {
    question: "How do I know if my model has improved after fine-tuning?",
    answer:
      "Go to the evaluation section, where you can compare your model with others and score them. You'll see a report with evaluation metrics to gauge your model's improvement. Our UI features intuitive data visualization, like GitHub's green commit indicators, showing more green for better scores, making it easy to see enhancements at a glance.",
  },
  {
    question: "Is my API key stored securely?",
    answer:
      "Yes, we take your security seriously. Your API key is stored securely, ensuring your data and access remain protected at all times.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is stored securely in a GDPR-compliant database provider. We prioritize the privacy and security of your data, ensuring it's handled with the utmost care.",
  },
];

export default function FAQSection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
