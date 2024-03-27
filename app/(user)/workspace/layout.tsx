"use client";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import UpsellButton from "@/components/upsellbutton";
import { UserButton } from "@clerk/nextjs";

import Image from "next/image";
import React from "react";

export default function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <a
          className="flex flex-row items-center p-5 ml-2 space-x-3 text-xl font-bold cursor-pointer hover:opacity-50"
          href={"/workspace"}
        >
          <Image
            src="/onellmlogocropped.png"
            alt="onellm logo"
            className="w-10"
            width={100}
            height={100}
          />

          <p className="text-[22px]">OneLLM</p>
        </a>
        <div className="flex flex-row items-center space-x-2 min-h-[60px] mr-7">
          <UpsellButton />
          <UserButton />
        </div>
      </div>
      <Separator />

      {children}

      <Toaster />
    </div>
  );
}
