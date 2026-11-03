import { memo, useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { FixedSizeList, areEqual } from "react-window";
import type { ListChildComponentProps } from "react-window";
import { EXERCISES, GROUPS } from "../../data/exercises";
import type { Exercise } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";
import { ExerciseRow } from "./ExerciseRow";
import { selectExercises } from "./exerciseSelectors";
import type { ExerciseSort, GroupFilter } from "./exerciseSelectors";
import { Icon } from "../../components/Icon";
import { addToSessionWithFeedback, startSessionWithFeedback } from "../session/sessionFeedback";
import { useRoutineDispatch, useRoutines } from "../routines/RoutineContext";
import { notify } from "../feedback/useToastStore";

interface ExerciseListData {
  exercises: Exercise[];
  onStart: (exercise: Exercise) => void;
  onAddToSession: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
}
const itemKey = (index: number, data: ExerciseListData) => data.exercises[index].id;
const VirtualRow = memo(function VirtualRow({
  index,
  style,
  data,
}: ListChildComponentProps<ExerciseListData>) {
  return (
    <div style={style}>
      <ExerciseRow
        exercise={data.exercises[index]}
        position={index + 1}
        onStart={data.onStart}
        onAddToSession={data.onAddToSession}
        onAddToRoutine={data.onAddToRoutine}
      />
    </div>
  );
}, areEqual);

export default function LibraryPage() {
  const [keyword, setKeyword] = useState("");
  const [group, setGroup] = useState<GroupFilter>("all");
  const [sort, setSort] = useState<ExerciseSort>("default");
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const activeRoutineId =
    routines.find((r) => r.id === selectedRoutineId)?.id ?? routines[0]?.id ?? "";
  const debounced = useDebounce(keyword, 300);
  const exercises = useMemo(
    () => selectExercises(EXERCISES, debounced, group, sort),
    [debounced, group, sort],
  );
  const onStart = useCallback(
    (exercise: Exercise) =>
      startSessionWithFeedback(
        exercises,
        exercises.findIndex((item) => item.id === exercise.id),
      ),
    [exercises],
  );
  const onAddToRoutine = useCallback(
    (exercise: Exercise) => {
      const routine = routines.find((item) => item.id === activeRoutineId);
      if (!routine) return;
      if (routine.exerciseIds.includes(exercise.id)) {
        notify("Bài tập đã có trong giáo án.", "info");
        return;
      }
      dispatch({
        type: "addExercise",
        payload: { routineId: activeRoutineId, exerciseId: exercise.id },
      });
      notify(`Đã thêm “${exercise.name}” vào “${routine.name}”.`);
    },
    [activeRoutineId, dispatch, routines],
  );
  const itemData = useMemo(
    () => ({
      exercises,
      onStart,
      onAddToSession: addToSessionWithFeedback,
      onAddToRoutine: activeRoutineId ? onAddToRoutine : undefined,
    }),
    [exercises, onStart, onAddToRoutine, activeRoutineId],
  );
  const search = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value),
    [],
  );

  return (
    <>
      <section className="page-intro">
        <h1>Bấm giờ tập luyện</h1>
      </section>
      <section className="library-section" aria-labelledby="library-title">
        <div className="section-heading">
          <div>
            <h2 id="library-title">
              Kho bài tập<span className="count-pill">10.000</span>
            </h2>
          </div>
        </div>
        <div className="library-panel">
          <div className="filters">
            <div className="field search-field">
              <label htmlFor="keyword">Tìm kiếm</label>
              <div className="search-input">
                <Icon name="search" />
                <input
                  id="keyword"
                  value={keyword}
                  onChange={search}
                  placeholder="Tên bài tập hoặc huấn luyện viên..."
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="group">Nhóm cơ</label>
              <select
                id="group"
                value={group}
                onChange={(e) => setGroup(e.target.value as GroupFilter)}
              >
                <option value="all">Tất cả</option>
                {GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="sort">Sắp xếp</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as ExerciseSort)}
              >
                <option value="default">Mặc định</option>
                <option value="name">Tên A–Z</option>
                <option value="duration">Thời lượng tăng dần</option>
              </select>
            </div>
            <div className="field routine-filter">
              <label htmlFor="active-routine">Giáo án đang chọn</label>
              <select
                id="active-routine"
                value={activeRoutineId}
                onChange={(e) => setSelectedRoutineId(e.target.value)}
                disabled={!routines.length}
              >
                {!routines.length && <option value="">Chưa có giáo án</option>}
                {routines.map((routine) => (
                  <option key={routine.id} value={routine.id}>
                    {routine.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="results-meta">
            <span role="status">
              Tìm thấy <strong>{exercises.length}</strong> bài tập
            </span>
          </div>
          <div className="table-scroll">
            <div role="table" aria-label="Danh sách bài tập" className="exercise-table">
              <div role="row" className="table-header">
                <span role="columnheader">#</span>
                <span role="columnheader">Bài tập</span>
                <span role="columnheader">Huấn luyện viên</span>
                <span role="columnheader">Nhóm cơ</span>
                <span role="columnheader">Thời gian</span>
                <span role="columnheader">Thao tác</span>
              </div>
              {exercises.length ? (
                <FixedSizeList
                  height={560}
                  itemSize={56}
                  itemCount={exercises.length}
                  width="100%"
                  itemData={itemData}
                  itemKey={itemKey}
                  overscanCount={2}
                >
                  {VirtualRow}
                </FixedSizeList>
              ) : (
                <div className="empty-state">
                  <Icon name="search" size={32} />
                  <h3>Không tìm thấy bài tập nào</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
