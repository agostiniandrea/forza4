import { test, expect } from "@playwright/test";
import { cell, completeSetup, dropInColumn } from "./support/board";

// Runs on the "mobile-safari" project only (see playwright.config.ts) — a
// lightweight touch-viewport pass on top of the full chromium suite, not a
// duplicate of it.
test.describe("Mobile smoke", () => {
  test("setup and a single move work on a touch viewport", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });

    await expect(page.getByTestId("mobile-layout")).toBeVisible();
    await expect(page.getByTestId("desktop-layout")).toBeHidden();

    await dropInColumn(page, 3);
    await expect(cell(page, 5, 3)).toHaveAttribute("aria-label", "Red disc");
  });
});
