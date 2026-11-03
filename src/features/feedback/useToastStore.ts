import { create } from "zustand";

type ToastTone = "success" | "info";
interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}
interface ToastState {
  toast: ToastMessage | null;
  show: (text: string, tone: ToastTone) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;
export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (text, tone) => set({ toast: { id: ++nextId, text, tone } }),
  dismiss: (id) => set((state) => (state.toast?.id === id ? { toast: null } : state)),
}));

export function notify(text: string, tone: ToastTone = "success"): void {
  useToastStore.getState().show(text, tone);
}
