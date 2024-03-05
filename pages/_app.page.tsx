import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${fontSans.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
