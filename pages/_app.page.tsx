import type { AppProps } from "next/app";
import "@/styles/globals.css";
// import '../styles/globals.css';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
