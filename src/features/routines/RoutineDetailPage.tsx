import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useRoutineDispatch, useRoutines } from "./RoutineContext";
import { EXERCISE_BY_ID } from "../../data/exerciseIndex";
import { formatDuration } from "../../utils/format";
import { startSessionWithFeedback } from "../session/sessionFeedback";
import { notify } from "../feedback/useToastStore";
import { Icon } from "../../components/Icon";
import type { Exercise } from "../../types";

export default function RoutineDetailPage() {
  const { id } = useParams();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const routine = routines.find((item) => item.id === id);
  const exercises = useMemo(
    () =>
      routine?.exerciseIds
        .map((exerciseId) => EXERCISE_BY_ID.get(exerciseId))
        .filter((item): item is Exercise => !!item) ?? [],
    [routine],
  );
  const total = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
  if (!routine)
    return (
      <div className="empty-state">
        <Icon name="list" size={34} />
        <h1 className="not-found-title">Không tìm thấy giáo án</h1>
        <Link to="/routines" className="link-button">
          Về danh sách giáo án
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <Link to="/routines" className="breadcrumb">
          ← Giáo án của bạn
        </Link>
        <h1 className="routine-detail-title">{routine.name}</h1>
        <div className="detail-meta">
          <span>{exercises.length} bài</span>
          <span>
            <Icon name="clock" size={14} />
            Tổng thời gian: {Math.floor(total / 60)} phút {total % 60} giây
          </span>
        </div>
      </div>
      <section className="library-panel">
        <div className="detail-toolbar">
          <h2>Thứ tự bài tập</h2>
          <button
            className="primary-button"
            disabled={!exercises.length}
            onClick={() => startSessionWithFeedback(exercises, 0)}
          >
            <Icon name="play" size={15} />
            Tập tất cả
          </button>
        </div>
        {exercises.length ? (
          <ol className="detail-list">
            {exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <span className="detail-position">{String(index + 1).padStart(2, "0")}</span>
                <div className="detail-exercise-name">
                  <strong>{exercise.name}</strong>
                  <span>HLV {exercise.trainer}</span>
                </div>
                <span className={`muscle-tag muscle-${exercise.group}`}>{exercise.group}</span>
                <span className="duration">{formatDuration(exercise.duration)}</span>
                <button
                  className="delete-button"
                  aria-label={`Bỏ ${exercise.name}`}
                  onClick={() => {
                    dispatch({
                      type: "removeExercise",
                      payload: { routineId: routine.id, exerciseId: exercise.id },
                    });
                    notify(`Đã bỏ “${exercise.name}” khỏi giáo án.`);
                  }}
                >
                  Bỏ
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <Icon name="plus" size={30} />
            <h3>Thêm bài cho buổi tập của bạn</h3>
            <Link to="/" className="link-button">
              Đến kho bài tập
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
