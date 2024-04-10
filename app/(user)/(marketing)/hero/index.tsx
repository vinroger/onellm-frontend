import React from "react";
import { HeroHighlight, Highlight } from "./hightlight";
import demoVideoMp4 from "../../../../public/landing/overall2.mp4";

function Hero() {
  return (
    <div>
      <HeroHighlight className="flex justify-center flex-col items-center">
        <div className="text-center">
          <div className="font-bold text-[40px]">
            Fine-tune, evaluate, and deploy your next LLM
          </div>
          <div className="font-bold text-[35px]">
            <Highlight>All without code.</Highlight>
          </div>
        </div>
        <div className="p-2 mt-10 rounded-xl text-center bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4 w-[67rem] ">
          <video
            controls
            autoPlay
            muted
            className="rounded-lg shadow-2xl bg-white/5 ring-1 ring-white/10 w-full h-full"
          >
            <source
              src="https://storage.googleapis.com/onellm/overall2.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </HeroHighlight>
    </div>
  );
}

export default Hero;
