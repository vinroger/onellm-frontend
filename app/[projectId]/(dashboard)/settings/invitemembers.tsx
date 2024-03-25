"use client";

import { CopyButton } from "@/components/copybutton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/utils/contexts/useProject";
import { generateJWTTokenAnyPayload } from "@/utils/functions/jwt";
import { ellipsisString } from "@/utils/functions/string";
import useAsync from "@/utils/hooks/useAsync";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import React, { useEffect } from "react";

function InviteMembersPage() {
  const { projectId } = useProjectContext();

  const { user } = useUser();

  const { execute, value, error } = useAsync(async () => {
    if (!user) return null;
    const res = await axios.post("/api/v1/invite", {
      projectId,
      inviterId: user.id,
    });
    return res.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div className="max-w-full">
      <h1 className="p-0 m-0 text-lg font-bold">Members</h1>
      <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
        Invite others to join your project and start collaborating together.
      </p>
      <div className="flex flex-row items-center justify-start">
        <p
          className={cn(
            "overflow-scroll whitespace-nowrap flex h-9 mr-3 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {value ?? (
            <div className="flex flex-row items-center justify-center">
              <LoaderIcon className="animate-spin mr-3" />
              Generating invite link...
            </div>
          )}
        </p>

        <div className="flex">
          <CopyButton
            textToCopy={value}
            className="w-4 h-4 text-green-700 rounded-md"
            tagStyle={{ transform: "translateX(3rem)" }}
            iconClassName="w-4 h-4 text-green-700"
          />
        </div>
      </div>
      <p className="text-xs font-normal mt-2 text-neutral-600">
        This link expires in 15 minutes. To generate a new invite link, please
        refresh the page.
      </p>
    </div>
  );
}

export default InviteMembersPage;
