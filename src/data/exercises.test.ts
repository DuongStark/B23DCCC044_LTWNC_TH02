import { describe, expect, it } from "vitest";
import { generateExercises } from "./exercises";

describe("generateExercises", () => {
  it("sinh đủ 10000 bài có id duy nhất và thời lượng 30–120 giây", () => {
    const exercises = generateExercises(10000);
    expect(exercises).toHaveLength(10000);
    expect(new Set(exercises.map((e) => e.id)).size).toBe(10000);
    expect(exercises.every((e) => e.duration >= 30 && e.duration <= 120)).toBe(true);
    expect(exercises.slice(0, 3)).toEqual([
      { id: "e1", name: "Đẩy tạ đơn 1", trainer: "Minh Khang", group: "Ngực", duration: 30 },
      { id: "e2", name: "Kéo tạ đơn 1", trainer: "Phương Anh", group: "Chân", duration: 67 },
      { id: "e3", name: "Gập tạ đơn 1", trainer: "Đức Anh", group: "Tay", duration: 104 },
    ]);
    expect(generateExercises(3)).toEqual(exercises.slice(0, 3));
  });
});
