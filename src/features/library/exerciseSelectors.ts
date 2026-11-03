import type { Exercise, MuscleGroup } from '../../types';

export type ExerciseSort = 'default' | 'name' | 'duration';
export type GroupFilter = MuscleGroup | 'all';

export function selectExercises(
  exercises: Exercise[], keyword: string, group: GroupFilter, sort: ExerciseSort,
): Exercise[] {
  const search = keyword.trim().toLocaleLowerCase('vi');
  const result = exercises.filter(exercise =>
    (group === 'all' || exercise.group === group) &&
    (!search || exercise.name.toLocaleLowerCase('vi').includes(search) ||
      exercise.trainer.toLocaleLowerCase('vi').includes(search)),
  );
  if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  if (sort === 'duration') result.sort((a, b) => a.duration - b.duration);
  return result;
}
