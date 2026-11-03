import { EXERCISES } from "./exercises";
export const EXERCISE_BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));
