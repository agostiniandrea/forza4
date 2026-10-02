import type { NextConfig } from "next";

/* Baseline security headers that are the same on every response, so a
   static list here is fine. The Content-Security-Policy header is NOT
   here — it needs a fresh per-request nonce (see middleware.ts for why,
   and for the CSP itself), and next.config.ts's headers() can't vary
   per request. style-src still needs 'unsafe-inline' there because
   styled-components' SSR registry injects real <style> tags.
   @vercel/analytics and @vercel/speed-insights are served/proxied same-origin
   on Vercel (/_vercel/insights/*, /_vercel/speed-insights/*), so 'self' plus
   middleware's 'strict-dynamic' covers them — no extra entries needed. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
