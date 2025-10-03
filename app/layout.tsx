import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import NextTopLoader from 'nextjs-toploader';
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export const metadata: Metadata = {
  title: "QuickDelivery - 10 Minute Delivery App",
  description: "Get your groceries delivered in 10 minutes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="min-h-screen bg-background grid-pattern">
          <NextTopLoader />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
