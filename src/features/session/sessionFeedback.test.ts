import { beforeEach, describe, expect, it } from "vitest";
import { EXERCISES } from "../../data/exercises";
import { useSessionStore } from "./useSessionStore";
import { useToastStore } from "../feedback/useToastStore";
import { addToSessionWithFeedback, startSessionWithFeedback } from "./sessionFeedback";

beforeEach(() => {
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  useToastStore.setState({ toast: null });
});

describe("phản hồi buổi tập", () => {
  it("bắt đầu đúng bài trong danh sách và báo tên bài đang tập", () => {
    startSessionWithFeedback([EXERCISES[0], EXERCISES[8]], 1);
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().queue.map((e) => e.id)).toEqual(["e1", "e9"]);
    expect(useToastStore.getState().toast?.text).toBe("Đang tập “Đẩy tạ đòn 1”.");
  });

  it("thêm thành công có thông báo, thêm trùng báo rõ và không nhân đôi queue", () => {
    addToSessionWithFeedback(EXERCISES[0]);
    expect(useToastStore.getState().toast).toMatchObject({
      tone: "success",
      text: "Đã thêm “Đẩy tạ đơn 1” vào buổi tập.",
    });
    addToSessionWithFeedback(EXERCISES[0]);
    expect(useSessionStore.getState().queue).toHaveLength(1);
    expect(useToastStore.getState().toast).toMatchObject({
      tone: "info",
      text: "Bài tập đã có trong buổi tập.",
    });
  });

  it("không báo bắt đầu thành công cho danh sách rỗng", () => {
    startSessionWithFeedback([], 0);
    expect(useToastStore.getState().toast).toBeNull();
    expect(useSessionStore.getState().isRunning).toBe(false);
  });
});
