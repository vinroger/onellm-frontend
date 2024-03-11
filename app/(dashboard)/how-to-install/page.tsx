import { Metadata } from "next";
import ApiKeySettings from "./apikey";

export const metadata: Metadata = {
  title: "My Page Title",
};

export default function Page() {
  return <ApiKeySettings />;
}
