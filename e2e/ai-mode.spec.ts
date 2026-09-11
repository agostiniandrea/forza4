import { test, expect } from "@playwright/test";
import { activeLayout, cell, completeSetup, dropInColumn } from "./support/board";

test.describe("vs AI", () => {
  test("the AI replies automatically after the human's move", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { mode: "ai", difficulty: "medium", p1: "ale" });

    await dropInColumn(page, 3);
    await expect(cell(page, 5, 3)).toHaveAttribute("aria-label", "Red disc");

    // The AI "thinks" for ~600ms, then drops on its own — no click from us.
    await expect(page.getByTestId("desktop-layout").getByText("Your turn")).toBeVisible();
    await expect(activeLayout(page).locator('[aria-label="Yellow disc"]')).toHaveCount(1);
  });

  test("the AI blocks an immediate vertical threat instead of losing", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { mode: "ai", difficulty: "hard", p1: "ale" });

    const yourTurn = page.getByTestId("desktop-layout").getByText("Your turn");

    // Stack column 0 three times. getBestMove()'s block-check is
    // unconditional (unlike its scoring heuristics) — whichever of its
    // three replies it uses to do it, the AI *must* have played column 0
    // itself by the time a fourth red disc there would complete the win.
    await dropInColumn(page, 0);
    await expect(yourTurn).toBeVisible();
    await dropInColumn(page, 0);
    await expect(yourTurn).toBeVisible();
    await dropInColumn(page, 0);
    await expect(yourTurn).toBeVisible();

    await dropInColumn(page, 0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
