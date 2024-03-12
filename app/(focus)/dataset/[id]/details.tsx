"use client";

import { usePathname } from "next/navigation";
import React from "react";

function Details() {
  const pathname = usePathname();

  if (!pathname) {
    throw new Error("No pathname");
  }

  const id = pathname.split("/dataset/")[1];

  return <div>{id}details</div>;
}

export default Details;
