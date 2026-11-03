import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExerciseRow } from "./ExerciseRow";
import type { Exercise } from "../../types";

const exercise: Exercise = {
  id: "e1",
  name: "Đẩy tạ đơn 1",
  trainer: "Minh Khang",
  group: "Ngực",
  duration: 30,
};
describe("ExerciseRow", () => {
  it("hiển thị thông tin và gọi Bắt đầu với đúng bài tập", () => {
    const onStart = vi.fn();
    render(<ExerciseRow exercise={exercise} position={1} onStart={onStart} />);
    expect(screen.getByText("Đẩy tạ đơn 1")).toBeInTheDocument();
    expect(screen.getByText("0:30")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));
    expect(onStart).toHaveBeenCalledExactlyOnceWith(exercise);
  });
});
