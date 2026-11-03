import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SavedState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id],
        })),
    }),
    {
      name: "workout-saved",
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch {
            /* Không chặn thao tác nếu storage bị khóa. */
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch {
            /* Storage có thể không khả dụng. */
          }
        },
      })),
      partialize: (state) => ({ ids: state.ids }),
      merge: (persisted, current) => {
        const ids =
          persisted && typeof persisted === "object" && "ids" in persisted ? persisted.ids : [];
        return {
          ...current,
          ids: Array.isArray(ids)
            ? [...new Set(ids.filter((id): id is string => typeof id === "string"))]
            : [],
        };
      },
    },
  ),
);
