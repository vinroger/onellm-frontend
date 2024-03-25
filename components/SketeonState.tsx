import React from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonState = ({ patternCount }: { patternCount: number }) => {
  // This example just repeats the pattern a fixed number of times.
  // You might want to dynamically calculate this based on the container's height.

  // Generate the pattern
  const patterns = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < patternCount; i++) {
    patterns.push(
      <div key={`pattern-${i}`} className="flex flex-col space-y-2">
        <Skeleton className="w-2/5 h-4" />
        <Skeleton className="w-3/5 h-4" />
        <Skeleton className="w-full h-4" />
        {i < patternCount - 1 && <div className="h-12" />}{" "}
        {/* Add space except after the last pattern */}
      </div>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{patterns}</>;
};

export default SkeletonState;
