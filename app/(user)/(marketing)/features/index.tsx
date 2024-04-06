"use client";

import React from "react";
import { StickyScroll } from "./stickyscroll";
import demoVideoMp4 from "../../../../public/landing/dataset.mp4";
import { Separator } from "@/components/ui/separator";

const featuresContent = [
  {
    title: "Feature 1",
    description: "Description 1",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <video
          controls
          autoPlay
          muted
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        >
          <source src={demoVideoMp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-3 text-xs text-neutral-600">Dataset</p>
      </div>
    ),
  },
  {
    title: "Feature 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi morbi tempus iaculis urna id. Nisl purus in mollis nunc sed id. Ullamcorper dignissim cras tincidunt lobortis feugiat. Sed viverra tellus in hac habitasse platea. Molestie at elementum eu facilisis. Rhoncus mattis rhoncus urna neque. Ipsum a arcu cursus vitae. Dolor sit amet consectetur adipiscing elit duis. Est ullamcorper eget nulla facilisi etiam. Dui faucibus in ornare quam viverra orci. Sed ullamcorper morbi tincidunt ornare massa eget egestas. In mollis nunc sed id. Adipiscing bibendum est ultricies integer quis auctor. Pellentesque sit amet porttitor eget dolor morbi non arcu risus.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <video
          controls
          autoPlay
          muted
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        >
          <source src={demoVideoMp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-3 text-xs text-neutral-600">Training</p>
      </div>
    ),
  },
  {
    title: "Feature 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi morbi tempus iaculis urna id. Nisl purus in mollis nunc sed id. Ullamcorper dignissim cras tincidunt lobortis feugiat. Sed viverra tellus in hac habitasse platea. Molestie at elementum eu facilisis. Rhoncus mattis rhoncus urna neque. Ipsum a arcu cursus vitae. Dolor sit amet consectetur adipiscing elit duis. Est ullamcorper eget nulla facilisi etiam. Dui faucibus in ornare quam viverra orci. Sed ullamcorper morbi tincidunt ornare massa eget egestas. In mollis nunc sed id. Adipiscing bibendum est ultricies integer quis auctor. Pellentesque sit amet porttitor eget dolor morbi non arcu risus.",
    content: (
      <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-full ">
        <video
          controls
          autoPlay
          muted
          className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
        >
          <source src={demoVideoMp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-3 text-xs text-neutral-600">Evaluation</p>
      </div>
    ),
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
