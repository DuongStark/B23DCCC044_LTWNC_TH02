import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { EXERCISES } from "../../data/exercises";
import type { Exercise } from "../../types";
import { Icon } from "../../components/Icon";
import { useSavedStore } from "./useSavedStore";
import { addToSessionWithFeedback, startSessionWithFeedback } from "../session/sessionFeedback";
import { ExerciseRow } from "../library/ExerciseRow";

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const exercises = useMemo(() => {
    const saved = new Set(ids);
    return EXERCISES.filter((e) => saved.has(e.id));
  }, [ids]);
  const onStart = useCallback(
    (exercise: Exercise) =>
      startSessionWithFeedback(
        exercises,
        exercises.findIndex((e) => e.id === exercise.id),
      ),
    [exercises],
  );
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <h1>
            Bài tập đã lưu<span className="count-pill">{exercises.length}</span>
          </h1>
        </div>
        <button
          className="primary-button"
          disabled={!exercises.length}
          onClick={() => startSessionWithFeedback(exercises, 0)}
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
                  onAddToSession={addToSessionWithFeedback}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-star">☆</span>
            <h3>Bạn chưa lưu bài tập nào</h3>
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
