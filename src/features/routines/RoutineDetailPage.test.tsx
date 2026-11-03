import { fireEvent, screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RoutineDetailPage from "./RoutineDetailPage";
import { renderWithProviders } from "../../test/renderWithProviders";
import { useSessionStore } from "../session/useSessionStore";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
});
const show = () =>
  renderWithProviders(
    <Routes>
      <Route path="/routines/:id" element={<RoutineDetailPage />} />
    </Routes>,
    ["/routines/r1"],
  );
describe("chi tiết giáo án", () => {
  it("hiện trạng thái không tìm thấy id", () => {
    show();
    expect(screen.getByText("Không tìm thấy giáo án")).toBeInTheDocument();
  });
  it("tính tổng 1 phút 37 giây, bắt đầu đúng thứ tự và bỏ bài", () => {
    localStorage.setItem(
      "workout-routines",
      JSON.stringify([{ id: "r1", name: "Ngày ngực", exerciseIds: ["e1", "e2", "unknown"] }]),
    );
    show();
    expect(screen.getByText("Tổng thời gian: 1 phút 37 giây")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tập tất cả" }));
    expect(useSessionStore.getState().queue.map((e) => e.id)).toEqual(["e1", "e2"]);
    expect(useSessionStore.getState().currentIndex).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Bỏ Đẩy tạ đơn 1" }));
    expect(screen.queryByText("Đẩy tạ đơn 1")).not.toBeInTheDocument();
    expect(screen.getByText("Tổng thời gian: 1 phút 7 giây")).toBeInTheDocument();
  });
  it("giáo án rỗng khóa Tập tất cả", () => {
    localStorage.setItem(
      "workout-routines",
      JSON.stringify([{ id: "r1", name: "Ngày nghỉ", exerciseIds: [] }]),
    );
    show();
    expect(screen.getByRole("button", { name: "Tập tất cả" })).toBeDisabled();
  });
});
