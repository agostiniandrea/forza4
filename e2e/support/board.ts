import type { Page } from "@playwright/test";

export const ROWS = 6;
export const COLS = 7;

/**
 * GamePage renders both the mobile and desktop layouts unconditionally —
 * a CSS media query (`display: none`) is the only thing that hides one of
 * them at any given viewport width. That means every `data-testid` inside
 * <Board> — the grid itself and all 42 cells — exists twice in the DOM at
 * once. Scoping every board/cell lookup to whichever layout is actually
 * visible resolves the ambiguity; querying `page.getByTestId(...)` directly
 * hits Playwright's strict-mode violation ("resolved to 2 elements").
 */
export function activeLayout(page: Page) {
  return page.locator(
    '[data-testid="mobile-layout"]:visible, [data-testid="desktop-layout"]:visible'
  );
}

export function boardGrid(page: Page) {
  return activeLayout(page).getByTestId("board-grid");
}

export function cell(page: Page, row: number, col: number) {
  return activeLayout(page).getByTestId(`cell-${row}-${col}`);
}

/**
 * Every cell in a column fires the same `onColumnClick(col)` handler (see
 * components/game/Board.tsx), so the top row is a stable click target
 * regardless of how full the column already is — no need to compute the
 * landing row ourselves.
 */
export function dropInColumn(page: Page, col: number) {
  return cell(page, 0, col).click();
}

/**
 * Plays a sequence of column drops, alternating players automatically (the
 * reducer alternates on every successful drop). Waits briefly between drops
 * so the ~500ms piece-drop animation from the previous move has settled
 * before the next click lands.
 */
export async function playSequence(page: Page, cols: number[]) {
  for (const col of cols) {
    await dropInColumn(page, col);
    await page.waitForTimeout(150);
  }
}

interface SetupOptions {
  mode?: "2p" | "ai";
  difficulty?: "easy" | "medium" | "hard";
  p1?: string;
  p2?: string;
}

/** Drives the name-entry screen and confirms, landing on the board. */
export async function completeSetup(page: Page, opts: SetupOptions = {}) {
  if (opts.mode === "ai") {
    await page.getByRole("button", { name: "vs AI", exact: true }).click();
    if (opts.difficulty) {
      await page
        .getByRole("button", { name: new RegExp(`^${opts.difficulty}$`, "i") })
        .click();
    }
  }
  if (opts.p1 !== undefined) {
    await page.locator("#name-p1").fill(opts.p1);
  }
  if (opts.p2 !== undefined && opts.mode !== "ai") {
    await page.locator("#name-p2").fill(opts.p2);
  }
  await page.getByRole("button", { name: /let's play/i }).click();
  // The board only mounts once setup is confirmed.
  await boardGrid(page).waitFor();
}
