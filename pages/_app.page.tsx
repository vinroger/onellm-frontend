/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unknown-property */
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <main className={`${fontSans.variable} font-sans`}>
        <style jsx global>{`
          html {
            font-family: ${fontSans.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </main>{" "}
    </ClerkProvider>
  );
}
