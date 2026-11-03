import type { Exercise } from "../../types";
import { useSessionStore } from "./useSessionStore";
import { notify } from "../feedback/useToastStore";

export function startSessionWithFeedback(exercises: Exercise[], startIndex: number): void {
  useSessionStore.getState().startSession(exercises, startIndex);
  const { queue, currentIndex } = useSessionStore.getState();
  const exercise = queue[currentIndex];
  if (exercise) notify(`Đang tập “${exercise.name}”.`);
}

export function addToSessionWithFeedback(exercise: Exercise): void {
  const state = useSessionStore.getState();
  if (state.queue.some((item) => item.id === exercise.id)) {
    notify("Bài tập đã có trong buổi tập.", "info");
    return;
  }
  state.addToSession(exercise);
  notify(`Đã thêm “${exercise.name}” vào buổi tập.`);
}
