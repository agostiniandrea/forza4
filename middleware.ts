import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-request CSP with a nonce.
 *
 * The App Router injects its own inline bootstrap/streaming scripts on
 * every response (e.g. `self.__next_f.push(...)`, used to stream the RSC
 * payload into the page as it renders) — there is no way to opt out of
 * this, it happens on every App Router page regardless of what the app
 * itself does. A static `script-src 'self'` (previously set from
 * next.config.ts's `headers()`) blocks those inline scripts outright,
 * which doesn't just disable "extra" features — it stops hydration from
 * completing at all, since the blocked scripts are part of how React
 * attaches to the server-rendered HTML. The page still *looks* right
 * (the HTML was rendered server-side) but nothing is interactive: clicks,
 * key presses and typed input stop reaching React's event handlers.
 *
 * Response headers from next.config.ts can't vary per request, so a nonce
 * (which must be fresh every request) has to be set here instead.
 * `'strict-dynamic'` extends trust from the nonce'd script to every script
 * it loads in turn, which is what lets Next's own chunk-loading chain (and
 * things like @vercel/analytics inserting its own script tag at runtime)
 * keep working without listing every host explicitly. Next.js detects the
 * `nonce-...` value in the `Content-Security-Policy` response header set
 * here and applies it automatically to the inline scripts it injects — see
 * https://nextjs.org/docs/app/guides/content-security-policy.
 *
 * `'unsafe-eval'` is added ONLY in development. `next dev`'s Fast Refresh
 * (`@next/react-refresh-utils`) calls eval() at runtime to register/compare
 * component modules across hot reloads — blocking that doesn't just disable
 * HMR, it throws mid-registration and leaves the affected component's event
 * handlers half-wired (some still work, some silently stop responding,
 * depending on exactly which handlers React Refresh had touched when the
 * throw happened). That's what caused the Playwright regression: it only
 * ever ran against `yarn dev` locally (see playwright.config.ts's
 * `webServer.command`), never against the production build CI uses, which
 * doesn't ship Fast Refresh's eval-based code at all. So the production CSP
 * stays exactly as strict as before — this relaxation never reaches it.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
