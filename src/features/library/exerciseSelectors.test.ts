import { describe, expect, it } from "vitest";
import { EXERCISES } from "../../data/exercises";
import { selectExercises } from "./exerciseSelectors";

describe("lọc và sắp xếp kho bài tập", () => {
  it.each([
    ["đẩy", "all", 1250],
    ["ĐẨY", "Vai", 250],
    ["đức anh", "all", 1000],
    ["xyz", "all", 0],
  ] as const)("tìm %s với nhóm %s được %i bài", (keyword, group, count) => {
    expect(selectExercises(EXERCISES, keyword, group, "default")).toHaveLength(count);
  });
  it("sắp xếp tên theo tiếng Việt mà không thay đổi dữ liệu gốc", () => {
    const sorted = selectExercises(EXERCISES, "", "all", "name");
    expect(sorted[0].name).toBe("Bật chậm 1");
    expect(EXERCISES[0].id).toBe("e1");
  });
  it("sắp xếp thời lượng tăng dần", () => {
    const sorted = selectExercises(EXERCISES, "", "all", "duration");
    expect(sorted[0].duration).toBe(30);
    expect(sorted.at(-1)?.duration).toBe(120);
    expect(sorted.every((e, i) => i === 0 || e.duration >= sorted[i - 1].duration)).toBe(true);
  });
});
