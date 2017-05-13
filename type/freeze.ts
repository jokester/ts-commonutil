/**
 * Known problems:
 *
 * Builtin types, like Function and RegExp, may be incorrectly mapped.
 *
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
};

/**
 * Cast a value to its DeepReadonly<T> type
 *
 * @export
 * @template T
 * @param {T} arg
 * @returns
 */
export function deepFreeze<T>(arg: T) {
    return arg as any as DeepReadonly<T>;
}

export function freeze<T>(arg: T) {
    return arg as Readonly<T>;
}