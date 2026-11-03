export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}
export type RoutineAction =
  | { type: "create"; payload: { id: string; name: string } }
  | { type: "rename"; payload: { id: string; name: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "addExercise"; payload: { routineId: string; exerciseId: string } }
  | { type: "removeExercise"; payload: { routineId: string; exerciseId: string } };

export function validateRoutineName(
  name: string,
  routines: Routine[],
  excludeId?: string,
): string | null {
  const normalized = name.trim().toLocaleLowerCase("vi");
  if (!normalized) return "Tên giáo án không được để trống";
  if (
    routines.some(
      (routine) => routine.id !== excludeId && routine.name.toLocaleLowerCase("vi") === normalized,
    )
  )
    return "Tên giáo án đã tồn tại";
  return null;
}

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case "create": {
      if (
        validateRoutineName(action.payload.name, state) ||
        state.some((r) => r.id === action.payload.id)
      )
        return state;
      return [
        ...state,
        { id: action.payload.id, name: action.payload.name.trim(), exerciseIds: [] },
      ];
    }
    case "rename": {
      if (validateRoutineName(action.payload.name, state, action.payload.id)) return state;
      return state.map((routine) =>
        routine.id === action.payload.id
          ? { ...routine, name: action.payload.name.trim() }
          : routine,
      );
    }
    case "remove":
      return state.filter((routine) => routine.id !== action.payload.id);
    case "addExercise":
      return state.map((routine) => {
        if (
          routine.id !== action.payload.routineId ||
          routine.exerciseIds.includes(action.payload.exerciseId)
        )
          return routine;
        return { ...routine, exerciseIds: [...routine.exerciseIds, action.payload.exerciseId] };
      });
    case "removeExercise":
      return state.map((routine) =>
        routine.id === action.payload.routineId
          ? {
              ...routine,
              exerciseIds: routine.exerciseIds.filter((id) => id !== action.payload.exerciseId),
            }
          : routine,
      );
  }
}
