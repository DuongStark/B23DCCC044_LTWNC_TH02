import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { EXERCISES } from "../../data/exercises";
import type { Exercise } from "../../types";
import { Icon } from "../../components/Icon";
import { useSavedStore } from "./useSavedStore";
import { useSessionStore } from "../session/useSessionStore";
import { ExerciseRow } from "../library/ExerciseRow";

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const startSession = useSessionStore((state) => state.startSession);
  const addToSession = useSessionStore((state) => state.addToSession);
  const exercises = useMemo(() => {
    const saved = new Set(ids);
    return EXERCISES.filter((e) => saved.has(e.id));
  }, [ids]);
  const onStart = useCallback(
    (exercise: Exercise) =>
      startSession(
        exercises,
        exercises.findIndex((e) => e.id === exercise.id),
      ),
    [exercises, startSession],
  );
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <p className="eyebrow">DÀNH CHO LẦN TẬP TIẾP THEO</p>
          <h1>
            Bài tập đã lưu<span className="count-pill">{exercises.length}</span>
          </h1>
          <p>Giữ những bài yêu thích. Sẵn sàng tập bất cứ lúc nào.</p>
        </div>
        <button
          className="primary-button"
          disabled={!exercises.length}
          onClick={() => startSession(exercises, 0)}
        >
          <Icon name="play" size={15} />
          Tập tất cả
        </button>
      </div>
      <section className="library-panel" aria-label="Các bài tập đã lưu">
        {exercises.length ? (
          <div className="table-scroll">
            <div className="exercise-table" role="table" aria-label="Danh sách bài tập đã lưu">
              {exercises.map((exercise, index) => (
                <ExerciseRow
                  key={exercise.id}
                  exercise={exercise}
                  position={index + 1}
                  onStart={onStart}
                  onAddToSession={addToSession}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-star">☆</span>
            <h3>Bạn chưa lưu bài tập nào</h3>
            <p>Nhấn ngôi sao bên cạnh bài tập yêu thích để lưu lại.</p>
            <Link to="/" className="link-button">
              Khám phá kho bài tập
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
