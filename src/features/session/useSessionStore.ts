import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [], currentIndex: -1, isRunning: false, elapsed: 0,
  startSession: (exercises, startIndex) => {
    if (!Number.isInteger(startIndex) || startIndex < 0 || startIndex >= exercises.length) {
      set({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
      return;
    }
    set({ queue: [...exercises], currentIndex: startIndex, isRunning: true, elapsed: 0 });
  },
  toggleRun: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    if (!queue.length) return;
    const index = Math.max(0, currentIndex);
    set({ currentIndex: index, isRunning: !isRunning, elapsed: elapsed >= queue[index].duration ? 0 : elapsed });
  },
  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0) return;
    if (currentIndex >= queue.length - 1) set({ isRunning: false });
    else set({ currentIndex: currentIndex + 1, elapsed: 0 });
  },
  prev: () => {
    const { currentIndex, elapsed } = get();
    if (currentIndex < 0) return;
    set({ currentIndex: elapsed > 3 ? currentIndex : Math.max(0, currentIndex - 1), elapsed: 0 });
  },
  addToSession: exercise => {
    if (!get().queue.some(item => item.id === exercise.id)) set({ queue: [...get().queue, exercise] });
  },
  tick: () => {
    const { isRunning, queue, currentIndex, elapsed } = get();
    const exercise = queue[currentIndex];
    if (!isRunning || !exercise) return;
    const updated = Math.min(elapsed + 1, exercise.duration);
    set({ elapsed: updated });
    if (updated >= exercise.duration) get().next();
  },
}));
