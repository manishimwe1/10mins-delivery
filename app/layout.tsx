import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
export const metadata: Metadata = {
  title: "QuickDelivery - 10 Minute Delivery App",
  description: "Get your groceries delivered in 10 minutes",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        >
          <div className="min-h-screen bg-background grid-pattern">
            <NextTopLoader color="oklch(0.65 0.2 142)" showSpinner={false} />
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </div>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
