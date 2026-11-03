import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function freeze(page: Page) {
  await page.clock.install({ time: new Date("2026-11-03T08:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-03T08:00:01Z"));
}
const exercise = (page: Page, id: string) => page.locator(`[data-exercise-id="${id}"]`);
const menu = (page: Page, name: string) =>
  page.getByRole("navigation").getByRole("link", { name, exact: true });

test("kho 10000 bài: ảo hóa, debounce chính xác, lọc và sort", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 10000 bài tập");
  const rows = page.locator("[data-exercise-id]");
  expect(await rows.count()).toBeGreaterThanOrEqual(10);
  expect(await rows.count()).toBeLessThanOrEqual(15);
  await freeze(page);
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("đẩy");
  await page.clock.runFor(299);
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 10000 bài tập");
  await page.clock.runFor(1);
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 1250 bài tập");
  await page.getByLabel("Nhóm cơ", { exact: true }).selectOption("Vai");
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 250 bài tập");
  await page.getByLabel("Nhóm cơ", { exact: true }).selectOption("all");
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("đức anh");
  await page.clock.runFor(300);
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 1000 bài tập");
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("xyz");
  await page.clock.runFor(300);
  await expect(page.getByText("Không tìm thấy bài tập nào")).toBeVisible();
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("");
  await page.clock.runFor(300);
  await page.getByLabel("Sắp xếp", { exact: true }).selectOption("name");
  await expect(rows.first()).toContainText("Bật chậm 1");
  await page.getByLabel("Sắp xếp", { exact: true }).selectOption("default");
  const viewport = page.getByRole("table").locator(":scope > div").nth(1);
  await viewport.evaluate((el) => {
    el.scrollTop = 56 * 9000;
    el.dispatchEvent(new Event("scroll"));
  });
  await expect(exercise(page, "e9001")).toBeVisible();
  expect(await rows.count()).toBeLessThanOrEqual(15);
});

test("đồng hồ: chạy, dừng, tiếp tục và tự sang bài", async ({ page }) => {
  await page.goto("/");
  await freeze(page);
  await exercise(page, "e2").getByRole("button", { name: "Bắt đầu", exact: true }).click();
  const session = page.getByRole("region", { name: "Đồng hồ buổi tập" });
  await expect(session).toContainText("Còn lại: 1:07");
  await page.clock.runFor(5000);
  await expect(session).toContainText("Còn lại: 1:02");
  await session.getByRole("button", { name: "Tạm dừng" }).click();
  await page.clock.runFor(3000);
  await expect(session).toContainText("Còn lại: 1:02");
  await session.getByRole("button", { name: "Bắt đầu", exact: true }).click();
  await session.getByRole("button", { name: "Sau" }).click();
  await expect(session).toContainText("Còn lại: 1:44");
  await exercise(page, "e1").getByRole("button", { name: "Bắt đầu", exact: true }).click();
  await page.clock.runFor(30000);
  await expect(session).toContainText("Đang tập: Kéo tạ đơn 1 – HLV Phương Anh");
  await expect(session).toContainText("Còn lại: 1:07");
});

test("buổi tập giữ danh sách đã lọc dù người dùng đổi bộ lọc", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("đẩy");
  await expect(page.getByRole("status")).toHaveText("Tìm thấy 1250 bài tập");
  await expect(page.locator("[data-exercise-id]").nth(1)).toContainText("Đẩy tạ đòn 1");
  await page
    .locator("[data-exercise-id]")
    .first()
    .getByRole("button", { name: "Bắt đầu", exact: true })
    .click();
  await page.getByLabel("Tìm kiếm", { exact: true }).fill("kéo");
  await expect(page.locator("[data-exercise-id]").first()).toContainText("Kéo tạ đơn 1");
  const session = page.getByRole("region", { name: "Đồng hồ buổi tập" });
  await session.getByRole("button", { name: "Sau" }).click();
  await expect(session).toContainText("Đang tập: Đẩy");
  await expect(session).toContainText("Buổi tập: 1250 bài");
});

test("bài đã lưu tồn tại sau F5 và Tập tất cả hoạt động", async ({ page }) => {
  await page.goto("/");
  for (const id of ["e1", "e3"])
    await exercise(page, id).getByRole("button", { name: "Lưu bài tập", exact: true }).click();
  await menu(page, "Đã lưu").click();
  await page.reload();
  await expect(page.locator("[data-exercise-id]")).toHaveCount(2);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("workout-saved")!).state.ids),
  ).toEqual(["e1", "e3"]);
  await page.getByRole("button", { name: "Tập tất cả" }).click();
  await expect(page.getByRole("region", { name: "Đồng hồ buổi tập" })).toContainText(
    "Buổi tập: 2 bài",
  );
  for (const id of ["e1", "e3"])
    await exercise(page, id).getByRole("button", { name: "Bỏ lưu", exact: true }).click();
  await expect(page.getByText("Bạn chưa lưu bài tập nào")).toBeVisible();
});

test("giáo án: validation, thêm không trùng, tổng thời gian, reload và xóa", async ({ page }) => {
  await page.goto("/routines");
  await page.getByRole("button", { name: "Tạo", exact: true }).click();
  await expect(page.getByText("Tên giáo án không được để trống")).toBeVisible();
  await page.getByLabel("Tên giáo án").fill("Ngày ngực");
  await page.getByRole("button", { name: "Tạo", exact: true }).click();
  await expect(page.getByRole("link", { name: "Ngày ngực", exact: true })).toBeVisible();
  await page.getByLabel("Tên giáo án").fill("ngày NGỰC");
  await page.getByRole("button", { name: "Tạo", exact: true }).click();
  await expect(page.getByText("Tên giáo án đã tồn tại")).toBeVisible();
  await menu(page, "Kho bài tập").click();
  await expect(page.getByLabel("Giáo án đang chọn")).toContainText("Ngày ngực");
  for (const id of ["e1", "e2", "e1"])
    await exercise(page, id).getByRole("button", { name: "+ Giáo án", exact: true }).click();
  await menu(page, "Giáo án").click();
  await page.getByRole("link", { name: "Ngày ngực", exact: true }).click();
  await expect(page.getByText("Tổng thời gian: 1 phút 37 giây")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Tổng thời gian: 1 phút 37 giây")).toBeVisible();
  await page.getByRole("button", { name: "Tập tất cả" }).click();
  await expect(page.getByRole("region", { name: "Đồng hồ buổi tập" })).toContainText(
    "Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang",
  );
  await page.getByRole("button", { name: "Bỏ Đẩy tạ đơn 1", exact: true }).click();
  await expect(page.getByText("Tổng thời gian: 1 phút 7 giây")).toBeVisible();
  await menu(page, "Giáo án").click();
  await page.getByRole("button", { name: "Xóa Ngày ngực" }).click();
  await expect(page.getByText("Giáo án đầu tiên đang chờ bạn")).toBeVisible();
});

test("lazy chunks chỉ tải khi mở trang, theme và bố cục mobile", async ({ page }) => {
  const scripts: string[] = [];
  const errors: string[] = [];
  page.on("response", (response) => {
    if (response.url().includes(".js")) scripts.push(response.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Kho bài tập/ })).toBeVisible();
  expect(scripts.some((url) => /SavedPage|RoutinesPage|RoutineDetailPage/.test(url))).toBe(false);
  await menu(page, "Đã lưu").click();
  await expect(page.getByText("Bạn chưa lưu bài tập nào")).toBeVisible();
  expect(scripts.some((url) => url.includes("SavedPage-"))).toBe(true);
  await menu(page, "Giáo án").click();
  await expect(page.getByLabel("Tên giáo án")).toBeVisible();
  expect(scripts.some((url) => url.includes("RoutinesPage-"))).toBe(true);
  await page.getByLabel("Tên giáo án").fill("Buổi sáng");
  await page.getByRole("button", { name: "Tạo", exact: true }).click();
  await page.getByRole("link", { name: "Buổi sáng", exact: true }).click();
  await expect(page.getByText("Thêm bài cho buổi tập của bạn")).toBeVisible();
  expect(scripts.some((url) => url.includes("RoutineDetailPage-"))).toBe(true);
  await menu(page, "Kho bài tập").click();
  await page.getByRole("button", { name: "Giao diện tối", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: "artifacts/workout-dark.png", fullPage: true });
  await page.getByRole("button", { name: "Giao diện sáng", exact: true }).click();
  await page.screenshot({ path: "artifacts/workout-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("Tìm kiếm", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "artifacts/workout-mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("thông báo phản hồi khi lưu, thêm trùng và tạo giáo án", async ({ page }) => {
  await page.goto("/");
  await exercise(page, "e1").getByRole("button", { name: "Lưu bài tập", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Đã lưu bài tập." })).toBeVisible();
  await exercise(page, "e1").getByRole("button", { name: "+ Buổi tập", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Đã thêm “Đẩy tạ đơn 1” vào buổi tập." }),
  ).toBeVisible();
  await exercise(page, "e1").getByRole("button", { name: "+ Buổi tập", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Bài tập đã có trong buổi tập." }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Đồng hồ buổi tập" })).toContainText(
    "Buổi tập: 1 bài",
  );
  await page.getByRole("button", { name: "Đóng thông báo" }).click();
  await expect(page.locator(".toast")).toHaveCount(0);

  await menu(page, "Giáo án").click();
  await page.getByLabel("Tên giáo án").fill("Ngày ngực");
  await page.getByRole("button", { name: "Tạo", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Đã tạo giáo án “Ngày ngực”." }),
  ).toBeVisible();
  await menu(page, "Kho bài tập").click();
  await exercise(page, "e1").getByRole("button", { name: "+ Giáo án", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Đã thêm “Đẩy tạ đơn 1” vào “Ngày ngực”." }),
  ).toBeVisible();
  await exercise(page, "e1").getByRole("button", { name: "+ Giáo án", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Bài tập đã có trong giáo án." }),
  ).toBeVisible();
  await page.screenshot({ path: "artifacts/feedback-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "artifacts/feedback-mobile.png", fullPage: true });
});
