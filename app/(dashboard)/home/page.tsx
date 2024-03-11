import { Metadata } from "next";
import Home from "./home-page";

export const metadata: Metadata = {
  title: "My Page Title",
};

export default function Page() {
  return <Home />;
}
