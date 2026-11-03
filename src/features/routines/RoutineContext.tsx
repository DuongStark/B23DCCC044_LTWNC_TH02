import { createContext, useContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { routineReducer } from "./routineReducer";
import type { Routine, RoutineAction } from "./routineReducer";
import { withLogger } from "./withLogger";

const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);
const loggedReducer = withLogger(routineReducer);

function readRoutines(): Routine[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem("workout-routines") ?? "[]");
    if (!Array.isArray(raw)) return [];
    const routines: Routine[] = [];
    for (const candidate of raw) {
      const item: unknown = candidate;
      if (
        !item ||
        typeof item !== "object" ||
        !("id" in item) ||
        !("name" in item) ||
        !("exerciseIds" in item)
      )
        continue;
      if (
        typeof item.id !== "string" ||
        !item.id ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        !Array.isArray(item.exerciseIds)
      )
        continue;
      const { id, name } = item;
      const exerciseIds: unknown[] = item.exerciseIds;
      if (
        routines.some(
          (r) =>
            r.id === id || r.name.toLocaleLowerCase("vi") === name.trim().toLocaleLowerCase("vi"),
        )
      )
        continue;
      routines.push({
        id,
        name: name.trim(),
        exerciseIds: [
          ...new Set(
            exerciseIds.filter(
              (exerciseId): exerciseId is string => typeof exerciseId === "string",
            ),
          ),
        ],
      });
    }
    return routines;
  } catch {
    return [];
  }
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, dispatch] = useReducer(loggedReducer, undefined, readRoutines);
  useEffect(() => {
    try {
      localStorage.setItem("workout-routines", JSON.stringify(routines));
    } catch {
      /* Vẫn dùng được state trong bộ nhớ khi storage bị khóa. */
    }
  }, [routines]);
  return (
    <RoutineDispatchContext.Provider value={dispatch}>
      <RoutineStateContext.Provider value={routines}>{children}</RoutineStateContext.Provider>
    </RoutineDispatchContext.Provider>
  );
}

export function useRoutines(): Routine[] {
  const value = useContext(RoutineStateContext);
  if (!value) throw new Error("useRoutines phải được dùng trong RoutineProvider");
  return value;
}
export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const value = useContext(RoutineDispatchContext);
  if (!value) throw new Error("useRoutineDispatch phải được dùng trong RoutineProvider");
  return value;
}
