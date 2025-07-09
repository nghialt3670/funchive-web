export const catchError = <T>(fn: () => T): [null, T] | [Error, undefined] => {
  try {
    return [null, fn()];
  } catch (err) {
    return [err as Error, undefined];
  }
};
