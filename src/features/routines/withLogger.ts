export function withLogger<S, A extends { type: string }>(
  reducer: (state: S, action: A) => S,
): (state: S, action: A) => S {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) console.log(action.type, { before: state, after: nextState });
    return nextState;
  };
}
