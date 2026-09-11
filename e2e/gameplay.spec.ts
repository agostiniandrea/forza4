import { test, expect } from "@playwright/test";
import { boardGrid, cell, completeSetup, dropInColumn, playSequence } from "./support/board";

test.describe("2-player gameplay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { p1: "ale", p2: "bob" });
  });

  test("pieces stack correctly and turns alternate", async ({ page }) => {
    await dropInColumn(page, 3);
    await expect(cell(page, 5, 3)).toHaveAttribute("aria-label", "Red disc");
    await dropInColumn(page, 3);
    await expect(cell(page, 4, 3)).toHaveAttribute("aria-label", "Yellow disc");
    await dropInColumn(page, 3);
    await expect(cell(page, 3, 3)).toHaveAttribute("aria-label", "Red disc");
  });

  test("a vertical four-in-a-row ends the game and shows the winner", async ({ page }) => {
    // P1 (red) stacks column 0 four times; P2 plays column 1 in between.
    await playSequence(page, [0, 1, 0, 1, 0, 1, 0]);

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { name: "ALE wins!" })).toBeVisible();

    for (const [row, col] of [[5, 0], [4, 0], [3, 0], [2, 0]] as const) {
      await expect(cell(page, row, col)).toHaveAttribute(
        "aria-label",
        "Red disc — winning piece"
      );
    }
  });

  test("a horizontal four-in-a-row on the bottom row is detected", async ({ page }) => {
    // P1 fills the bottom row (row 5), columns 0-3; P2 plays column 4 in between.
    await playSequence(page, [0, 4, 1, 4, 2, 4, 3]);

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole("heading", { name: "ALE wins!" })).toBeVisible();
  });

  test("Play again resets the board but keeps the running score", async ({ page }) => {
    await playSequence(page, [0, 1, 0, 1, 0, 1, 0]);
    await page.getByRole("button", { name: "Play again" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(cell(page, 5, 0)).toHaveAttribute("aria-label", "Empty");
    await expect(page.getByTestId("desktop-layout").getByText("01")).toBeVisible();
  });

  test("Change players resets both the board and the running score", async ({ page }) => {
    await playSequence(page, [0, 1, 0, 1, 0, 1, 0]);
    await page.getByRole("button", { name: "↺ Change players" }).click();

    await expect(page.getByRole("group", { name: "Game mode" })).toBeVisible();
    await completeSetup(page, { p1: "cal", p2: "dee" });

    await expect(page.getByRole("heading", { name: "CAL", exact: true })).toBeVisible();
    // The previous pair's 1-0 tally must not carry over to this new match.
    await expect(page.getByTestId("desktop-layout").getByText("00")).toHaveCount(2);
  });

  test("the board is fully playable via keyboard only", async ({ page }) => {
    const grid = boardGrid(page);
    await grid.focus();
    // Starts hovering column 3 (GamePage's initial hover state); move to column 0.
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");
    await expect(cell(page, 5, 0)).toHaveAttribute("aria-label", "Red disc");
  });
});
