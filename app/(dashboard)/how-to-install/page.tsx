import { Metadata } from "next";
import ApiKeySettings from "./apikey";

export const metadata: Metadata = {
  title: "OneLLM - API Key Settings",
};

export default function Page() {
  return <ApiKeySettings />;
}
