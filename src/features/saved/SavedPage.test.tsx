import { fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import SavedPage from "./SavedPage";
import { useSavedStore } from "./useSavedStore";
import { useSessionStore } from "../session/useSessionStore";
import { renderWithProviders } from "../../test/renderWithProviders";

beforeEach(() => {
  localStorage.clear();
  useSavedStore.setState({ ids: [] });
});
describe("SavedPage", () => {
  it("hiện lời nhắc và khóa Tập tất cả khi chưa lưu bài", () => {
    renderWithProviders(<SavedPage />);
    expect(screen.getByText("Bạn chưa lưu bài tập nào")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tập tất cả" })).toBeDisabled();
  });
  it("tập đúng các bài đã lưu, bắt đầu từ dòng hoặc thêm vào queue", () => {
    useSavedStore.setState({ ids: ["e1", "e3", "unknown"] });
    renderWithProviders(<SavedPage />);
    fireEvent.click(screen.getByRole("button", { name: "Tập tất cả" }));
    expect(useSessionStore.getState().queue.map((e) => e.id)).toEqual(["e1", "e3"]);
    const last = within(screen.getAllByRole("row")[1]);
    fireEvent.click(last.getByRole("button", { name: "Bắt đầu" }));
    expect(useSessionStore.getState().currentIndex).toBe(1);
    fireEvent.click(last.getByRole("button", { name: "+ Buổi tập" }));
    expect(useSessionStore.getState().queue).toHaveLength(2);
    fireEvent.click(last.getByRole("button", { name: "Bỏ lưu" }));
    expect(screen.queryByText("Gập tạ đơn 1")).not.toBeInTheDocument();
  });
});
