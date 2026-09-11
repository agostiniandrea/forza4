import { test, expect } from "@playwright/test";
import { boardGrid, completeSetup } from "./support/board";

test.describe("Name entry / setup", () => {
  test("defaults to 2-player mode with no difficulty selector", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("group", { name: "Game mode" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Difficulty" })).toHaveCount(0);
  });

  test("selecting vs AI reveals the difficulty picker", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "vs AI", exact: true }).click();
    await expect(page.getByRole("group", { name: "Difficulty" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Easy", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Medium", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hard", exact: true })).toBeVisible();
  });

  test("player name input uppercases and truncates to 4 characters", async ({ page }) => {
    await page.goto("/");
    await page.locator("#name-p1").fill("alexander");
    await expect(page.locator("#name-p1")).toHaveValue("ALEX");
  });

  test("blank names fall back to P1 / P2 once the game starts", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /let's play/i }).click();
    await expect(boardGrid(page)).toBeVisible();
    await expect(page.getByRole("heading", { name: "P1", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "P2", exact: true })).toBeVisible();
  });

  test("vs AI mode locks player 2's name to CPU", async ({ page }) => {
    await page.goto("/");
    await completeSetup(page, { mode: "ai", difficulty: "easy", p1: "ale" });
    await expect(page.getByRole("heading", { name: "CPU", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ALE", exact: true })).toBeVisible();
  });
});
