import { act, render, renderHook, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoutineProvider, useRoutineDispatch, useRoutines } from "./RoutineContext";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
});
describe("RoutineContext", () => {
  it("hooks báo lỗi rõ khi dùng ngoài Provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const expectedError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", expectedError);
    try {
      expect(() => renderHook(() => useRoutines())).toThrow(
        "useRoutines phải được dùng trong RoutineProvider",
      );
      expect(() => renderHook(() => useRoutineDispatch())).toThrow(
        "useRoutineDispatch phải được dùng trong RoutineProvider",
      );
    } finally {
      window.removeEventListener("error", expectedError);
    }
  });
  it("khôi phục và ghi giáo án khi danh sách thay đổi", () => {
    localStorage.setItem(
      "workout-routines",
      JSON.stringify([{ id: "r1", name: "Ngày ngực", exerciseIds: ["e1"] }]),
    );
    const { result } = renderHook(
      () => ({ routines: useRoutines(), dispatch: useRoutineDispatch() }),
      { wrapper: RoutineProvider },
    );
    expect(result.current.routines[0].name).toBe("Ngày ngực");
    act(() =>
      result.current.dispatch({
        type: "addExercise",
        payload: { routineId: "r1", exerciseId: "e2" },
      }),
    );
    expect(JSON.parse(localStorage.getItem("workout-routines")!)[0].exerciseIds).toEqual([
      "e1",
      "e2",
    ]);
  });
  it.each(["{hỏng", "{}", "[null]", '[{"id":3}]'])("bỏ qua storage sai %s", (raw) => {
    localStorage.setItem("workout-routines", raw);
    const { result } = renderHook(() => useRoutines(), { wrapper: RoutineProvider });
    expect(result.current).toEqual([]);
  });
  it("component chỉ dùng dispatch không render lại theo state", () => {
    let renders = 0;
    function DispatchOnly() {
      const dispatch = useRoutineDispatch();
      renders++;
      return (
        <button
          onClick={() => dispatch({ type: "create", payload: { id: "r1", name: "Ngày chân" } })}
        >
          Tạo
        </button>
      );
    }
    function Names() {
      return (
        <p>
          {useRoutines()
            .map((r) => r.name)
            .join(",")}
        </p>
      );
    }
    render(
      <RoutineProvider>
        <DispatchOnly />
        <Names />
      </RoutineProvider>,
    );
    const before = renders;
    fireEvent.click(screen.getByRole("button", { name: "Tạo" }));
    expect(screen.getByText("Ngày chân")).toBeInTheDocument();
    expect(renders).toBe(before);
  });
});
