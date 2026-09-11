import { defineConfig, devices } from "@playwright/test";

/**
 * The whole app is a single client-rendered page with no server data
 * fetching, so a dev server is enough — no seeded cache, no API mocking,
 * unlike a data-heavy app's E2E setup. `reuseExistingServer` locally means
 * `yarn dev` already running in another terminal is picked up as-is instead
 * of fighting over the port; CI always starts a fresh one.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // smoke.spec.ts asserts the *mobile* layout is the visible one — at
      // this project's desktop viewport that's false by design (DesktopMain
      // is what's showing), so it belongs to mobile-safari only.
      testIgnore: /smoke\.spec\.ts/,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
      // Smoke coverage only — the full suite already runs on chromium at
      // desktop size; this just catches touch/viewport regressions on the
      // layout the majority of real players will actually use.
      testMatch: /smoke\.spec\.ts/,
    },
  ],

  webServer: {
    // Locally: the dev server, so a run picks up an already-running
    // `yarn dev` instead of fighting it for the port. In CI: a real
    // production build — dev mode's on-demand compilation makes the first
    // hit per route slow and an inconsistent basis for timing-sensitive
    // assertions (the AI's move, the drop animation, the game-over delay).
    command: process.env.CI ? "yarn build && yarn start" : "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
