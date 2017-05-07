/**
 * Type calcuation: usable in TS 2.1 and up
 */

/**
 * Known problems of Mapped Type:
 *
 * Builtin types, including Function and RegExp, may have their
 * properties/methods incorrectly mapped.
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
};

export function deepFreeze<T>(v: T) {
    return v as any as DeepReadonly<T>;
}

export function freeze<T>(v: T) {
    return v as Readonly<T>;
}

