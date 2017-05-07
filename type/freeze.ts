/**
 * Known problems:
 *
 * Builtin types, like Function and RegExp, may be incorrectly mapped.
 *
 */
type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

function id<T>(v: T) {
    return v;
}

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

// NOT working. I wanted a type that 'exposes' private properties / methods
export type Exposed<T, V extends keyof T> = {
    [P in (V & keyof T)]: T[P]
};
