import { LoaderIcon } from "lucide-react";
import React from "react";

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-w-full min-h-full">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}

export default LoadingState;
