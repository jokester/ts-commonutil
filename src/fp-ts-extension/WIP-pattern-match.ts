import { Kind, URIS } from 'fp-ts/HKT';
import { Option } from 'fp-ts/Option';
import { either, option } from 'fp-ts';

interface MatchFunc {
  <R, A1>(guard1: Guard<A1>, map1: (v: A1) => R): Option<R>;
  <R, A1, A2>(guard1: Guard<A1>, map1: (v: A1) => R, guard2: Guard<A2>, map2: (v: A2) => R): Option<R>;
  <R, A1, A2, A3>(
    guard1: Guard<A1>,
    map1: (v: A1) => R,
    guard2: Guard<A2>,
    map2: (v: A2) => R,
    guard3: Guard<A3>,
    map3: (v: A3) => R,
  ): Option<R>;
}

class Matcher {
  constructor(readonly value: unknown) {}
  matched<T>(predicate: (v: T) => v is T): this is { value: T } {
    return predicate(this.value as any);
  }
  map<T, R>(predicate: (v: T) => v is T, transform: (v: T) => R): Option<R> {
    return predicate(this.value as any) ? option.some<R>(transform(this.value as any)) : option.none;
  }
  match: MatchFunc = (...values: any[]) => {
    for (let i = 0; i < values.length; i += 2) {
      if (values[i](this.value)) return option.some(values[i + 1](this.value));
    }
    return option.none;
  };
}

export function $case(value: unknown): MatchFunc {
  return (...branches: any[]) => {
    for (let i = 0; i < branches.length; i += 2) {
      if (branches[i](value)) return option.some(branches[i + 1](value));
    }
    return option.none;
  };
}

interface Guard<T> {
  (v: unknown): v is T;
}

function demo(): void {
  const f = $case(1)(
    (v): v is string => typeof v === 'string',
    (strValue) => 'string',
    (v): v is number => typeof v === 'number',
    (numValue) => 'number',
  );
}
