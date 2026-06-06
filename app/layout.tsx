import type { ReactNode } from "react";
import { Space_Grotesk, Sarabun } from "next/font/google";
import { getLocale } from "next-intl/server";
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

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${sarabun.variable}`}
    >
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
