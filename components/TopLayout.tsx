import React from "react";
import { useRouter } from "next/router";

const TopLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return <div>hello</div>;
};

export default TopLayout;
