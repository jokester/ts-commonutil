/**
 * Type calculation: usable since around TS 2.8
 */

/**
 * A simple Mapped Type may incorrectly maps some types, including Function and RegExp
 * we have to manually add specializations with infer and `? :`
 *
 */
/* eslint-disable */
export type DeepReadonly<T> = T extends string | number | symbol | null | undefined | void
  ? T
  : T extends RegExp
  ? T
  : T extends Function
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : T extends Set<infer E>
  ? ReadonlySet<Readonly<E>>
  : T extends Array<infer E>
  ? readonly Readonly<E>[] // FIXME: this does not make U deep-readonly
  : T extends {}
  ? { readonly [k in keyof T]: Readonly<T[k]> }
  : never;

/* eslint-enable */

/**
 * Cast a T value to its DeepReadonly<T> type
 */
export function deepFreeze<T>(arg: T) {
  return arg as any as DeepReadonly<T>;
}

export function freeze<T>(arg: T) {
  return arg as Readonly<T>;
}

type ArrayElem<T extends unknown[]> = T extends ReadonlyArray<infer U> ? U : never;

// XXX: not working
type DeepReadonlyArray<T extends any[]> = T extends (infer U)[] ? DeepReadonly<U>[] : never;
