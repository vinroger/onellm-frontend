"use client";

import { Button } from "@/components/ui/button";
import useAsync from "@/utils/hooks/useAsync";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";

function ProjectPage() {
  const { token } = useParams<{ token: string }>() as { token: string };

  const [status, setStatus] = React.useState("IDLE");

  const {
    execute,
    value,
    status: fetchStatus,
  } = useAsync(async () => {
    const res = await axios.post("/api/v1/invite/token", {
      token,
    });
    if (res.status === 200) {
      setStatus("DONE");
    }
    if (res.status === 400) {
      setStatus("ERROR");
      return;
    }
    return res.data;
  });

  console.log(
    "%capp/project/invite/[token]/page.tsx:31 status",
    "color: #007acc;",
    status
  );

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center flex-col">
      <h1 className="p-0 m-0 text-lg font-bold mb-5">Join a Project</h1>

      <Button
        onClick={() => execute()}
        disabled={status === "DONE"}
        className="mb-5"
      >
        Accept!
      </Button>
      {status === "DONE" && (
        <div className="flex flex-col justify-center items-center">
          <div className="p-4 bg-green-100 text-green-700 rounded-md mb-5">
            You have successfully joined the project!
          </div>
          <div>
            <a href="/workspace" className="underline">
              Go to Dashboard →
            </a>
          </div>
        </div>
      )}
      {fetchStatus === "ERRORED" && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          An error occurred. The invite link is invalid or expired. If this
          issue persists, please contact the project owner or OneLLM support.
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
