import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Explicit viewport export prevents Next.js 16 from rendering a streaming
// metadata boundary that causes a dev-mode hydration mismatch.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Forza 4",
    template: "%s — Forza 4",
  },
  description: "A beautiful, accessible Connect Four game. Play against a friend or vs AI.",
  openGraph: {
    title: "Forza 4",
    description: "A beautiful, accessible Connect Four game. Play against a friend or vs AI.",
    type: "website",
    url: "https://forza4-game.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
