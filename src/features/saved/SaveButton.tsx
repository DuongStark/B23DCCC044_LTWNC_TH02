import { useSavedStore } from "./useSavedStore";
import { notify } from "../feedback/useToastStore";

export function SaveButton({ id }: { id: string }) {
  const saved = useSavedStore((state) => state.ids.includes(id));
  const toggle = useSavedStore((state) => state.toggle);
  return (
    <button
      className={`icon-button save-button ${saved ? "is-saved" : ""}`}
      aria-label={saved ? "Bỏ lưu" : "Lưu bài tập"}
      aria-pressed={saved}
      onClick={() => {
        toggle(id);
        notify(saved ? "Đã bỏ lưu bài tập." : "Đã lưu bài tập.");
      }}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}
