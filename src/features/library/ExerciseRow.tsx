import { memo } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';
import { Icon } from '../../components/Icon';

interface ExerciseRowProps {
  exercise: Exercise;
  position: number;
  onStart?: (exercise: Exercise) => void;
}

export const ExerciseRow = memo(function ExerciseRow({ exercise, position, onStart }: ExerciseRowProps) {
  return (
    <div className="exercise-row" role="row" data-exercise-id={exercise.id}>
      <span role="cell" className="row-number">{String(position).padStart(2, '0')}</span>
      <span role="cell" className="exercise-name">{exercise.name}</span>
      <span role="cell" className="trainer">{exercise.trainer}</span>
      <span role="cell"><span className={`muscle-tag muscle-${exercise.group}`}>{exercise.group}</span></span>
      <span role="cell" className="duration">{formatDuration(exercise.duration)}</span>
      <div role="cell" className="row-actions">
        <button className="start-button" disabled={!onStart} onClick={() => onStart?.(exercise)}><Icon name="play" size={12} />Bắt đầu</button>
        <button className="icon-button save-button" aria-label="Lưu bài tập" disabled>☆</button>
        <button className="compact-button" disabled>+ Buổi tập</button>
        <button className="compact-button" disabled>+ Giáo án</button>
      </div>
    </div>
  );
});
