import { beforeEach, describe, expect, it } from "vitest";
import { EXERCISES } from "../../data/exercises";
import { useSessionStore } from "./useSessionStore";

const queue = EXERCISES.slice(0, 3);
beforeEach(() =>
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 }),
);
const state = () => useSessionStore.getState();

describe("store buổi tập", () => {
  it("bắt đầu đúng bài và giữ bản chụp queue riêng", () => {
    const input = [...queue];
    state().startSession(input, 1);
    input.pop();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true, queue });
  });
  it("tick ở giây cuối tự chuyển bài kế tiếp về giây 0", () => {
    state().startSession(queue, 0);
    useSessionStore.setState({ elapsed: 29 });
    state().tick();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true });
  });
  it("next ở bài cuối dừng đồng hồ", () => {
    state().startSession(queue, 2);
    state().next();
    expect(state().isRunning).toBe(false);
    expect(state().currentIndex).toBe(2);
  });
  it("hết bài cuối giữ thời gian ở thời lượng bài và có thể tập lại", () => {
    state().startSession([queue[0]], 0);
    useSessionStore.setState({ elapsed: 29 });
    state().tick();
    expect(state()).toMatchObject({ elapsed: 30, isRunning: false });
    state().tick();
    expect(state().elapsed).toBe(30);
    state().toggleRun();
    expect(state()).toMatchObject({ elapsed: 0, isRunning: true });
  });
  it("tạm dừng giữ nguyên giây và next không tự bật lại", () => {
    state().startSession(queue, 0);
    state().tick();
    state().toggleRun();
    state().tick();
    expect(state().elapsed).toBe(1);
    state().next();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: false });
  });
  it.each([
    [3, 0],
    [4, 1],
  ])("Trước tại giây %i chuyển về index %i", (elapsed, index) => {
    state().startSession(queue, 1);
    useSessionStore.setState({ elapsed });
    state().prev();
    expect(state()).toMatchObject({ currentIndex: index, elapsed: 0 });
  });
  it("Trước ở bài đầu chỉ reset về giây 0", () => {
    state().startSession(queue, 0);
    useSessionStore.setState({ elapsed: 2 });
    state().prev();
    expect(state()).toMatchObject({ currentIndex: 0, elapsed: 0 });
  });
  it("thêm bài không trùng và bắt đầu được queue vừa thêm", () => {
    state().addToSession(queue[0]);
    state().addToSession(queue[0]);
    expect(state().queue).toEqual([queue[0]]);
    state().toggleRun();
    expect(state()).toMatchObject({ currentIndex: 0, elapsed: 0, isRunning: true });
  });
  it.each([-1, 3, 0.5, Number.NaN])("bỏ qua chỉ số bắt đầu không hợp lệ %s", (index) => {
    state().startSession(queue, index);
    expect(state()).toMatchObject({ queue: [], currentIndex: -1, elapsed: 0, isRunning: false });
  });
  it("các nút khi chưa có bài không làm đồng hồ chạy", () => {
    state().startSession([], 0);
    state().toggleRun();
    state().next();
    state().prev();
    state().tick();
    expect(state()).toMatchObject({ queue: [], currentIndex: -1, elapsed: 0, isRunning: false });
  });
});
