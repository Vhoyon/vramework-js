export type InitializableType<T> = new (...args: unknown[]) => T;

export type InitializableTypeWithArgs<T, A extends unknown[]> = new (...args: A) => T;
