import { expect, test } from "@playwright/test";

test("homepage renders the Hugo buffer list", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".section-header h1")).toHaveText("Open buffers");
  await expect(page.locator(".buffer-row")).toHaveCount(8);
  await expect(page.locator("[data-lw-main]")).toBeVisible();
});

test("homepage uses recent buffers when available", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "linewise:buffers",
      JSON.stringify([
        { href: "/posts/welcome-to-linewise/", label: "welcome-to-linewise" },
        { href: "/posts/comments/", label: "comments" },
      ])
    );
  });

  await page.goto("/");
  await expect(page.locator(".buffer-row")).toHaveCount(2);
  await expect(page.locator(".buffer-row").first()).toContainText("comments");
  await expect(page.locator(".buffer-row").first()).toContainText("Recently visited buffer");
});

test("posts list replaces the old archive route", async ({ page }) => {
  await page.goto("/posts/");
  await expect(page.locator(".section-header h1")).toHaveText("Posts");
  await expect(page.locator(".buffer-row").first()).toBeVisible();

  const response = await page.request.get("/archive/");
  expect(response.status()).toBe(404);
});

test("find page lazy-loads /search.json", async ({ page }) => {
  await page.goto("/find/");
  await page.locator("#search").fill("vim");
  const rows = page.locator("#results [data-linewise-item]");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(page.locator("[data-status-meta]")).toContainText("matches");
});

test("command mode routes :oldfiles to /posts/", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press(":");
  await page.locator("[data-command-input]").fill("oldfiles");
  await page.locator("[data-command-input]").press("Enter");
  await expect(page).toHaveURL(/\/posts\//);
});

test("command mode keeps :buffers on home and routes :posts to archive", async ({ page }) => {
  await page.goto("/posts/");
  await page.keyboard.press(":");
  await page.locator("[data-command-input]").fill("buffers");
  await page.locator("[data-command-input]").press("Enter");
  await expect(page).toHaveURL(/\/$/);

  await page.keyboard.press(":");
  await page.locator("[data-command-input]").fill("posts");
  await page.locator("[data-command-input]").press("Enter");
  await expect(page).toHaveURL(/\/posts\//);
});

test("Ctrl+f remains available for browser find", async ({ page }) => {
  await page.goto("/posts/getting-started/");
  const wasPrevented = await page.evaluate(() => {
    let prevented = false;
    document.addEventListener(
      "keydown",
      event => {
        if (event.key === "f" && event.ctrlKey) {
          window.setTimeout(() => {
            prevented = event.defaultPrevented;
          });
        }
      },
      { capture: true, once: true }
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true, cancelable: true })
    );
    return new Promise<boolean>(resolve => window.setTimeout(() => resolve(prevented)));
  });

  expect(wasPrevented).toBe(false);
});

test("file explorer tree scrolls independently", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 360 });
  await page.goto("/");

  const metrics = await page.locator(".tree").evaluate(element => {
    const style = window.getComputedStyle(element);
    return {
      overflowY: style.overflowY,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    };
  });

  expect(metrics.overflowY).toBe("auto");
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

test("tag pages render through Hugo taxonomy templates", async ({ page }) => {
  await page.goto("/tags/vim/");
  await expect(page.locator(".section-header h1")).toHaveText("#Vim");
  await expect(page.locator(".buffer-row")).toHaveCount(3);
});

test("default comments provider does not render giscus", async ({ page }) => {
  await page.goto("/posts/welcome-to-linewise/");
  await expect(page.locator('script[src="https://giscus.app/client.js"]')).toHaveCount(0);
});

test("code blocks can be copied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as Window & { __copiedCode?: string }).__copiedCode = value;
        },
      },
    });
  });

  await page.goto("/posts/getting-started/");
  const copyButton = page.locator("[data-code-copy]").first();
  await expect(copyButton).toHaveText("copy");
  await copyButton.click();
  await expect(copyButton).toHaveText("copied");
  await expect
    .poll(() => page.evaluate(() => (window as Window & { __copiedCode?: string }).__copiedCode))
    .toContain("hugo new site my-blog");
});

test.describe("mobile explorer", () => {
  test.use({ viewport: { width: 393, height: 852 } });

  test("explorer starts hidden and can open", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/explorer-hidden/);
    await page.locator("[data-open-explorer]").click();
    await expect(page.locator("html")).toHaveClass(/explorer-open/);
  });
});
