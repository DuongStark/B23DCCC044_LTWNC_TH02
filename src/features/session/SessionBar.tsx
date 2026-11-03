import { useEffect } from "react";
import { Icon } from "../../components/Icon";
import { useSessionStore } from "./useSessionStore";
import { CountdownBar } from "./CountdownBar";
import { notify } from "../feedback/useToastStore";

export function SessionBar() {
  const current = useSessionStore((state) => state.queue[state.currentIndex]);
  const count = useSessionStore((state) => state.queue.length);
  const isRunning = useSessionStore((state) => state.isRunning);
  const tick = useSessionStore((state) => state.tick);
  const toggleRun = useSessionStore((state) => state.toggleRun);
  const next = useSessionStore((state) => state.next);
  const prev = useSessionStore((state) => state.prev);
  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, tick]);

  function handleToggle() {
    toggleRun();
    notify(
      useSessionStore.getState().isRunning ? "Buổi tập đang chạy." : "Đã tạm dừng buổi tập.",
      "info",
    );
  }

  function handleNext() {
    const before = useSessionStore.getState();
    next();
    const after = useSessionStore.getState();
    const exercise = after.queue[after.currentIndex];
    if (exercise)
      notify(
        before.currentIndex === after.currentIndex
          ? "Đã kết thúc buổi tập."
          : `Chuyển sang “${exercise.name}”.`,
        "info",
      );
  }

  function handlePrevious() {
    const before = useSessionStore.getState();
    prev();
    const after = useSessionStore.getState();
    const exercise = after.queue[after.currentIndex];
    if (exercise)
      notify(
        before.currentIndex === after.currentIndex
          ? "Đã về đầu bài tập."
          : `Chuyển về “${exercise.name}”.`,
        "info",
      );
  }

  return (
    <section className="session-bar" aria-label="Đồng hồ buổi tập">
      <div className="session-inner">
        <div className="session-information">
          <div className="session-text">
            <p className="session-title">
              {current
                ? `Đang tập: ${current.name} – HLV ${current.trainer}`
                : "Chưa bắt đầu buổi tập"}
            </p>
            <span className="session-meta">Buổi tập: {count} bài</span>
          </div>
        </div>
        <div className="session-controls">
          <button
            className="icon-button"
            aria-label="Trước"
            disabled={!current}
            onClick={handlePrevious}
          >
            <Icon name="back" size={16} />
          </button>
          <button
            className="play-control"
            aria-label={isRunning ? "Tạm dừng" : "Bắt đầu"}
            disabled={!count}
            onClick={handleToggle}
          >
            <Icon name={isRunning ? "pause" : "play"} size={18} />
          </button>
          <button className="icon-button" aria-label="Sau" disabled={!current} onClick={handleNext}>
            <Icon name="next" size={16} />
          </button>
        </div>
        <CountdownBar />
      </div>
    </section>
  );
}
