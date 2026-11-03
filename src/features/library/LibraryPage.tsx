import { memo, useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import type { Exercise } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { ExerciseRow } from './ExerciseRow';
import { selectExercises } from './exerciseSelectors';
import type { ExerciseSort, GroupFilter } from './exerciseSelectors';
import { Icon } from '../../components/Icon';
import { useSessionStore } from '../session/useSessionStore';
import { useRoutineDispatch, useRoutines } from '../routines/RoutineContext';

interface ExerciseListData { exercises: Exercise[]; onStart: (exercise: Exercise) => void; onAddToSession: (exercise: Exercise) => void; onAddToRoutine?: (exercise: Exercise) => void }
const itemKey = (index: number, data: ExerciseListData) => data.exercises[index].id;
const VirtualRow = memo(function VirtualRow({ index, style, data }: ListChildComponentProps<ExerciseListData>) {
  return <div style={style}><ExerciseRow exercise={data.exercises[index]} position={index + 1} onStart={data.onStart} onAddToSession={data.onAddToSession} onAddToRoutine={data.onAddToRoutine} /></div>;
}, areEqual);

export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<GroupFilter>('all');
  const [sort, setSort] = useState<ExerciseSort>('default');
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const activeRoutineId = routines.find(r => r.id === selectedRoutineId)?.id ?? routines[0]?.id ?? '';
  const debounced = useDebounce(keyword, 300);
  const exercises = useMemo(() => selectExercises(EXERCISES, debounced, group, sort), [debounced, group, sort]);
  const startSession = useSessionStore(state => state.startSession);
  const addToSession = useSessionStore(state => state.addToSession);
  const onStart = useCallback((exercise: Exercise) => startSession(exercises, exercises.findIndex(item => item.id === exercise.id)), [exercises, startSession]);
  const onAddToRoutine = useCallback((exercise: Exercise) => {
    if (activeRoutineId) dispatch({ type: 'addExercise', payload: { routineId: activeRoutineId, exerciseId: exercise.id } });
  }, [activeRoutineId, dispatch]);
  const itemData = useMemo(() => ({ exercises, onStart, onAddToSession: addToSession, onAddToRoutine: activeRoutineId ? onAddToRoutine : undefined }), [exercises, onStart, addToSession, onAddToRoutine, activeRoutineId]);
  const search = useCallback((event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value), []);

  return (
    <>
      <section className="page-intro">
        <div><p className="eyebrow">KHÔNG GIAN TẬP LUYỆN CỦA BẠN</p><h1>Mỗi nhịp tập.<br /><span>Một bước tiến.</span></h1><p className="intro-copy">Chọn bài tập, tạo giáo án và tìm nhịp tập của riêng bạn.<br />Bắt đầu nhỏ. Kiên trì mỗi ngày.</p></div>
        <div className="intro-card"><div className="intro-card-top"><span className="status-dot" />SẴN SÀNG KHI BẠN SẴN SÀNG<Icon name="pulse" size={32} /></div><strong>10.000<span>bài tập để khám phá</span></strong><div className="intro-card-footer"><span>5 nhóm cơ</span><span>10 huấn luyện viên</span><Icon name="arrow" /></div></div>
      </section>
      <section className="library-section" aria-labelledby="library-title">
        <div className="section-heading"><div><p className="eyebrow">KHÁM PHÁ & LỰA CHỌN</p><h2 id="library-title">Kho bài tập<span className="count-pill">10.000</span></h2></div><span className="section-note"><Icon name="clock" size={15} />30–120 giây / bài tập</span></div>
        <div className="library-panel">
          <div className="filters">
            <div className="field search-field"><label htmlFor="keyword">Tìm kiếm</label><div className="search-input"><Icon name="search" /><input id="keyword" value={keyword} onChange={search} placeholder="Tên bài tập hoặc huấn luyện viên..." autoComplete="off" /></div></div>
            <div className="field"><label htmlFor="group">Nhóm cơ</label><select id="group" value={group} onChange={e => setGroup(e.target.value as GroupFilter)}><option value="all">Tất cả</option>{GROUPS.map(g => <option key={g}>{g}</option>)}</select></div>
            <div className="field"><label htmlFor="sort">Sắp xếp</label><select id="sort" value={sort} onChange={e => setSort(e.target.value as ExerciseSort)}><option value="default">Mặc định</option><option value="name">Tên A–Z</option><option value="duration">Thời lượng tăng dần</option></select></div>
            <div className="field routine-filter"><label htmlFor="active-routine">Giáo án đang chọn</label><select id="active-routine" value={activeRoutineId} onChange={e => setSelectedRoutineId(e.target.value)} disabled={!routines.length}>{!routines.length && <option value="">Chưa có giáo án</option>}{routines.map(routine => <option key={routine.id} value={routine.id}>{routine.name}</option>)}</select></div>
          </div>
          <div className="results-meta"><span role="status">Tìm thấy <strong>{exercises.length}</strong> bài tập</span><span className="muted">Chọn một bài để bắt đầu buổi tập</span></div>
          <div className="table-scroll"><div role="table" aria-label="Danh sách bài tập" className="exercise-table">
            <div role="row" className="table-header"><span role="columnheader">#</span><span role="columnheader">BÀI TẬP</span><span role="columnheader">HUẤN LUYỆN VIÊN</span><span role="columnheader">NHÓM CƠ</span><span role="columnheader">THỜI GIAN</span><span role="columnheader">THAO TÁC</span></div>
            {exercises.length ? <FixedSizeList height={560} itemSize={56} itemCount={exercises.length} width="100%" itemData={itemData} itemKey={itemKey} overscanCount={2}>{VirtualRow}</FixedSizeList> : <div className="empty-state"><Icon name="search" size={32} /><h3>Không tìm thấy bài tập nào</h3><p>Thử một từ khóa hoặc nhóm cơ khác nhé.</p></div>}
          </div></div>
          <div className="panel-footer"><span className="status-dot" />Nhịp tập tốt nhất là nhịp tập phù hợp với bạn.</div>
        </div>
      </section>
    </>
  );
}
