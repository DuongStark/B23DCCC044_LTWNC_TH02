import { chromium } from "@playwright/test";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const report = resolve("coverage/index.html");
await access(report);
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
);
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(report).href);
  await page.locator(".coverage-summary").waitFor();
  await page.screenshot({ path: resolve("coverage.png"), fullPage: true });
  console.log("Đã chụp bảng báo cáo coverage thật vào coverage.png");
} finally {
  await browser.close();
}
