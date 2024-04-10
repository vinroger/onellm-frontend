/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { StickyScroll } from "./stickyscroll";
import demoVideoMp4 from "../../../../public/landing/dataset.mp4";

const featuresContent = [
  {
    title: "Create Dataset",
    description:
      "Create a dataset by writing the chats between user and assistant, all in the browser.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <img
          alt="Dataset"
          src="/landing/screenshots/dataset.png"
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        />
        <p className="mt-3 text-xs text-neutral-600">Dataset</p>
      </div>
    ),
  },
  {
    title: "Integrate API Key",
    description:
      "Integrate your OpenAI API key to get access to the fine-tuning process. We support different models (Gemini, Llama, etc) soon.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <img
          alt="API Key"
          src="/landing/screenshots/openai.png"
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        />
        <p className="mt-3 text-xs text-neutral-600">API Key</p>
      </div>
    ),
  },
  {
    title: "Fine-tune the Model",
    description:
      " Fine-tune the model with the dataset you created, choose the base model and the hyperparameters.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <img
          alt="Training"
          src="/landing/screenshots/runtraining.png"
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        />
        <p className="mt-3 text-xs text-neutral-600">Fine-tune</p>
      </div>
    ),
  },
  {
    title: "Evaluate Performance",
    description:
      "After the training is done, you can try and run the model. Give the model a score and there will be a auto-generated heatmap that shows how well the fine-tuned model performs agains the base models.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <img
          alt="Training"
          src="/landing/screenshots/evaluation.png"
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        />
        <p className="mt-3 text-xs text-neutral-600">Evaluation</p>
      </div>
    ),
  },
  {
    title: "Deploy and Record the Usage",
    description:
      "Use your model out of the box with our SDK. If you are using OpenAI library, you only need to change the baseUrl and no code changes needed. Integrate with OneLLM APIKey to record the usage of the model. Know the usage of the model and the performance of the model.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <img
          alt="Training"
          src="/landing/screenshots/logs.png"
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        />
        <p className="mt-3 text-xs text-neutral-600">Logs</p>
      </div>
    ),
  },
  {
    title: "",
    description: "",
    content: <div className="p-10" />,
  },
];

function Features() {
  return (
    <div className="py-10 mt-20">
      <p className="font-semibold text-md text-center mt-2 mb-1 text-purple-700">
        HOW IT WORKS
      </p>

      <p className="text-neutral-700 text-center mb-5 text-md font-semibold">
        Curate dataset, add API key, run fine-tuning process, compare between
        models and iterate development.
      </p>
      {/* <div className="h-[0.15rem] w-1/4 self-center bg-faded-gradient" /> */}
      <Separator
        orientation="horizontal"
        className="w-[200px] mx-auto text-center mb-10 p-[1px]"
      />
      <StickyScroll content={featuresContent} />
    </div>
  );
}

export default Features;
