import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import ShimmerButton from "./aceternity/shimmerbutton";

function UpsellButton() {
  const { user } = useUser();

  const router = useRouter();

  const oneLLMUser = useAppSelector((state) => state.user);
  return (
    <div>
      {oneLLMUser.id && (
        <ShimmerButton
          className="h-8 mr-3 text-neutral-300"
          onClick={() => router.push("/workspace/billing")}
        >
          {oneLLMUser.subscriptionIsActive ? (
            <span className="">OneLLM Pro</span>
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </>
          )}
        </ShimmerButton>
      )}
    </div>
  );
}

export default UpsellButton;
