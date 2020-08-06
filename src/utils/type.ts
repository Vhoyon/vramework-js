export type InitializableType<T> = new () => T;

export type InitializableTypeWithArgs<T, A extends unknown[]> = new (...args: A) => T;
