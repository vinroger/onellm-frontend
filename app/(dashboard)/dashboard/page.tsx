import { Metadata } from "next";
import Home from "./home-page";

export const metadata: Metadata = {
  title: "OneLLM - Dashboard",
};

export default function Page() {
  return <Home />;
}
