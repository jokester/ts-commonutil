/**
 * Type calcuation: usable in TS 2.1 and up
 *
 * Known problems of Mapped Type:
 * Builtin types, including Function and RegExp, may be incorrectly mapped.
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
