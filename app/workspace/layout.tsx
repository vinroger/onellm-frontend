"use client";

import ShimmerButton from "@/components/aceternity/shimmerbutton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import useAsync from "@/utils/hooks/useAsync";
import { UserButton, useUser } from "@clerk/nextjs";

import axios from "axios";
import { Crown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Workspace({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const {
    value: projectsData,
    execute,
    status,
  } = useAsync(async () => {
    const response = await axios.get("/api/v1/projects");

    return response.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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
          <ShimmerButton
            className="h-10 mr-3 text-neutral-300"
            onClick={() => router.push("/workspace/billing")}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </ShimmerButton>
          <UserButton />
        </div>
      </div>
      <Separator />

      {children}

      <Toaster />
    </div>
  );
}