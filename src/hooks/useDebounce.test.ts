import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("giữ giá trị cũ trước 300ms, cập nhật đúng mốc 300ms", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "cũ" },
    });
    rerender({ value: "mới" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("cũ");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("mới");
  });
  it("hủy timeout trước khi gõ tiếp hoặc unmount", () => {
    vi.useFakeTimers();
    const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 1 },
    });
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 3 });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(3);
    rerender({ value: 4 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
