import React from "react";

function NonIdealStateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-7">
      <div className="flex flex-col items-center justify-center w-full h-full p-5 py-10 rounded-lg bg-neutral-100">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-md text-neutral-600">{description}</p>
      </div>
    </div>
  );
}

export default NonIdealStateCard;
