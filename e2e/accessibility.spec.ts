import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { completeSetup, playSequence } from "./support/board";

test.describe("Accessibility", () => {
  test("only one <main> landmark exists, even though two layouts render at once", async ({ page }) => {
    // MobileMain and DesktopMain both mount unconditionally (CSS media
    // queries pick which one is shown), so it's easy to accidentally give
    // both a <main> tag and end up with two "main" landmarks for one page.
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
  });

  test("the name-entry screen has no automatically detectable a11y violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("an active game screen has no automatically detectable a11y violations", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("the game-over modal has no automatically detectable a11y violations", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });
    await playSequence(page, [0, 1, 0, 1, 0, 1, 0]);
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    expect(results.violations).toEqual([]);
  });

  test("the game-over modal moves focus to Play again", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });
    await playSequence(page, [0, 1, 0, 1, 0, 1, 0]);

    await expect(page.getByRole("button", { name: "Play again" })).toBeFocused();
  });
});
