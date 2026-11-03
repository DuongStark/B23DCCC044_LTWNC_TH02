import { memo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRoutineDispatch, useRoutines } from './RoutineContext';
import { validateRoutineName } from './routineReducer';
import { Icon } from '../../components/Icon';

// Chỉ vùng thông báo đọc state; form và ô nhập chỉ cần dispatch.
function RoutineNameFeedback({ name, id }: { name: string; id: string }) {
  const routines = useRoutines();
  const error = routines.some(r => r.id === id) ? null : validateRoutineName(name, routines);
  return error ? <p role="alert" id="routine-name-error" className="field-error">{error}</p> : null;
}

export const RoutineCreateForm = memo(function RoutineCreateForm() {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [attempt, setAttempt] = useState<{ name: string; id: string } | null>(null);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = crypto.randomUUID();
    setAttempt({ name, id });
    dispatch({ type: 'create', payload: { id, name } });
  }
  return <section className="create-panel"><div><span className="feature-icon"><Icon name="plus" size={21} /></span><h2>Tạo một nhịp tập mới</h2><p>Một giáo án riêng, một mục tiêu rõ ràng.</p></div><form onSubmit={handleSubmit} noValidate><div className="field"><label htmlFor="routine-name">Tên giáo án</label><input id="routine-name" value={name} onChange={e => { setName(e.target.value); setAttempt(null); }} placeholder="Ví dụ: Ngày ngực, Buổi sáng năng lượng..." autoComplete="off" aria-describedby={attempt ? 'routine-name-error' : undefined} /></div><button type="submit" className="primary-button"><Icon name="plus" size={16} />Tạo</button>{attempt && <RoutineNameFeedback name={attempt.name} id={attempt.id} />}</form></section>;
});
