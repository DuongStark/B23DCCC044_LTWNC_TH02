import { Profiler } from "react";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LibraryPage from "./LibraryPage";
import { renderWithProviders } from "../../test/renderWithProviders";
import { useSessionStore } from "../session/useSessionStore";
import { useSavedStore } from "../saved/useSavedStore";
import * as format from "../../utils/format";

beforeEach(() => {
  localStorage.clear();
  useSavedStore.setState({ ids: [] });
  useSessionStore.setState({ queue: [], currentIndex: -1, elapsed: 0, isRunning: false });
  vi.spyOn(console, "log").mockImplementation(() => {});
});
describe("LibraryPage", () => {
  it("gõ chưa đủ debounce không render dòng; tick không cập nhật cả cây danh sách", () => {
    vi.useFakeTimers();
    const formatter = vi.spyOn(format, "formatDuration");
    const renders = vi.fn();
    renderWithProviders(
      <Profiler id="library" onRender={renders}>
        <LibraryPage />
      </Profiler>,
    );
    const calls = formatter.mock.calls.length;
    fireEvent.change(screen.getByLabelText("Tìm kiếm"), { target: { value: "đẩy" } });
    act(() => vi.advanceTimersByTime(299));
    expect(formatter).toHaveBeenCalledTimes(calls);
    expect(screen.getByRole("status")).toHaveTextContent("Tìm thấy 10000 bài tập");
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("status")).toHaveTextContent("Tìm thấy 1250 bài tập");
    fireEvent.click(within(screen.getAllByRole("row")[1]).getByRole("button", { name: "Bắt đầu" }));
    const commits = renders.mock.calls.length;
    act(() => useSessionStore.getState().tick());
    expect(renders).toHaveBeenCalledTimes(commits);
    expect(useSessionStore.getState().elapsed).toBe(1);
    fireEvent.change(screen.getByLabelText("Tìm kiếm"), { target: { value: "kéo" } });
    act(() => vi.advanceTimersByTime(300));
    expect(useSessionStore.getState().queue).toHaveLength(1250);
    expect(useSessionStore.getState().queue.every((e) => e.name.startsWith("Đẩy"))).toBe(true);
  });
  it("lưu bài chỉ cập nhật nút lưu; thêm vào buổi tập và giáo án không trùng", () => {
    localStorage.setItem(
      "workout-routines",
      JSON.stringify([{ id: "r1", name: "Ngày ngực", exerciseIds: [] }]),
    );
    const formatter = vi.spyOn(format, "formatDuration");
    renderWithProviders(<LibraryPage />);
    const first = within(screen.getAllByRole("row")[1]);
    const calls = formatter.mock.calls.length;
    fireEvent.click(first.getByRole("button", { name: "Lưu bài tập" }));
    expect(first.getByRole("button", { name: "Bỏ lưu" })).toHaveAttribute("aria-pressed", "true");
    expect(formatter).toHaveBeenCalledTimes(calls);
    fireEvent.click(first.getByRole("button", { name: "+ Buổi tập" }));
    expect(useSessionStore.getState().queue.map((e) => e.id)).toEqual(["e1"]);
    fireEvent.click(first.getByRole("button", { name: "+ Giáo án" }));
    fireEvent.click(first.getByRole("button", { name: "+ Giáo án" }));
    expect(JSON.parse(localStorage.getItem("workout-routines")!)[0].exerciseIds).toEqual(["e1"]);
    fireEvent.change(screen.getByLabelText("Nhóm cơ"), { target: { value: "Vai" } });
    expect(screen.getByRole("status")).toHaveTextContent("Tìm thấy 2000 bài tập");
    fireEvent.change(screen.getByLabelText("Sắp xếp"), { target: { value: "duration" } });
    expect(within(screen.getAllByRole("row")[1]).getByText("0:30")).toBeInTheDocument();
  });
  it("hiện trạng thái không tìm thấy sau debounce và khóa thêm giáo án khi chưa có", () => {
    vi.useFakeTimers();
    renderWithProviders(<LibraryPage />);
    expect(screen.getAllByRole("button", { name: "+ Giáo án" })[0]).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Tìm kiếm"), { target: { value: "xyz" } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText("Không tìm thấy bài tập nào")).toBeInTheDocument();
  });
});
