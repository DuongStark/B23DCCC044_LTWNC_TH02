import { useEffect } from "react";
import { useToastStore } from "./useToastStore";

export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const dismiss = useToastStore((state) => state.dismiss);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => dismiss(toast.id), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast, dismiss]);

  return (
    <div className="toast-position" aria-live="polite" aria-atomic="true">
      {toast && (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role="status">
          <span className="toast-symbol" aria-hidden="true">
            {toast.tone === "success" ? "✓" : "i"}
          </span>
          <span className="toast-message">{toast.text}</span>
          <button
            className="toast-close"
            aria-label="Đóng thông báo"
            onClick={() => dismiss(toast.id)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
