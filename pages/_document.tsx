import { Html, Head, Main, NextScript } from "next/document";
import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={`min-h-screen bg-background ${fontSans.variable} font-sans antialiased`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
