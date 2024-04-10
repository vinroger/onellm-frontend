import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { Crown } from "lucide-react";
import ShimmerButton from "./aceternity/shimmerbutton";

function UpsellButton() {
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
              <p className="text-sm">Upgrade to Pro</p>
            </>
          )}
        </ShimmerButton>
      )}
    </div>
  );
}

export default UpsellButton;
