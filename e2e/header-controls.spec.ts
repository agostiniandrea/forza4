import { test, expect } from "@playwright/test";
import { completeSetup } from "./support/board";

test.describe("Header controls", () => {
  test("sound toggle flips its label", async ({ page }) => {
    await page.goto("/");
    // The name-entry overlay sits at a higher z-index than the header and
    // covers it entirely while setup is in progress — clicking the sound
    // button there hangs on Playwright's actionability check (the element
    // is visible but pointer-blocked) until the test times out. Complete
    // setup first, same as a real player would before ever touching sound.
    await completeSetup(page, { p1: "ale", p2: "bob" });
    const soundBtn = page.getByRole("button", { name: /sound (on|off)/i });
    await expect(soundBtn).toHaveAttribute("aria-label", "Sound on");
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute("aria-label", "Sound off");
  });

  test("fullscreen control is offered on a browser that supports it", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /fullscreen/i })).toBeVisible();
  });

  test("New game returns to the setup screen mid-match", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });
    await page.getByRole("button", { name: "New game" }).click();
    await expect(page.getByRole("group", { name: "Game mode" })).toBeVisible();
  });
});
