import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ToastHost } from "./ToastHost";
import { notify, useToastStore } from "./useToastStore";

beforeEach(() => useToastStore.setState({ toast: null }));

describe("thông báo thao tác", () => {
  it("hiện thông báo ngắn và tự đóng sau 3 giây", () => {
    vi.useFakeTimers();
    render(<ToastHost />);
    act(() => notify("Đã lưu bài tập."));
    expect(screen.getByRole("status")).toHaveTextContent("Đã lưu bài tập.");
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("thao tác liên tiếp thay thông báo và không bị timer cũ đóng sớm", () => {
    vi.useFakeTimers();
    const { unmount } = render(<ToastHost />);
    act(() => notify("Đã lưu bài tập."));
    const oldId = useToastStore.getState().toast!.id;
    act(() => vi.advanceTimersByTime(2000));
    act(() => notify("Bài tập đã có trong buổi tập.", "info"));
    act(() => useToastStore.getState().dismiss(oldId));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("status")).toHaveTextContent("Bài tập đã có trong buổi tập.");
    fireEvent.click(screen.getByRole("button", { name: "Đóng thông báo" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    act(() => notify("Đã thêm bài tập."));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
