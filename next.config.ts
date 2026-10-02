import type { NextConfig } from "next";

/* Baseline security headers, including CSP, as one static list — this page
   is intentionally static (prerendered at build time, no per-request data),
   and a nonce-based CSP only works on dynamically-rendered pages: Next.js
   applies the nonce during server-side rendering by reading it off the
   request, but a static page's HTML is generated once at build time, before
   any request exists. A per-request nonce in the response header then never
   matches whatever (if anything) got baked into that static HTML, and every
   inline script Next.js injects — its own hydration/RSC bootstrap included —
   gets CSP-blocked. We hit exactly this in production (next start): it
   looked fine in `next dev` only because dev always re-renders fresh per
   request, which coincidentally keeps the nonce in sync.
   Forcing this single static page into dynamic rendering just to support a
   nonce isn't worth the trade-off (loses static optimization and CDN
   caching) for an app with no per-request data to begin with. So: no nonce,
   no middleware — 'unsafe-inline' for script-src, which is Next's own
   documented approach for apps that don't need nonces
   (https://nextjs.org/docs/app/guides/content-security-policy#without-nonces).
   'unsafe-eval' is added for script-src in development only — React/Next's
   dev-mode tooling (Fast Refresh, source-mapped error stacks) uses eval()
   there; neither uses it in production. style-src needs 'unsafe-inline'
   too, for styled-components' SSR registry injecting real <style> tags.
   @vercel/analytics and @vercel/speed-insights are served/proxied same-origin
   on Vercel (/_vercel/insights/*, /_vercel/speed-insights/*), so 'self'
   covers them — no extra script-src/connect-src entries needed. */
const isDev = process.env.NODE_ENV === "development";

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
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
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
