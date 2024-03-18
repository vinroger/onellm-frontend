import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "OneLLM",
  description: "Build datasets, fine-tune, and test your LLM without coding.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/onellmlogo-light.png",
        href: "/onellmlogo-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/onellmlogo.png",
        href: "/onellmlogo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={cn(
            "relative flex min-h-screen w-full flex-col scroll-smooth font-sans antialiased",
            fontSans.variable
          )}
        >
          <main>{children}</main>
        </body>
      </ClerkProvider>
    </html>
  );
}
