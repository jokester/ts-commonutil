import { DefaultMap } from '../collection/default-map';

export function groupBy<T, K extends string | number | symbol>(
  values: Iterable<T>,
  keyer: (value: T) => K,
): Record<K, T[]> {
  return Object.fromEntries(groupByAsMap(values, keyer)) as Record<K, T[]>;
}

export function groupByAsMap<T, K>(values: Iterable<T>, keyer: (value: T) => K): ReadonlyMap<K, T[]> {
  const map = new DefaultMap<K, T[]>(() => []);
  for (const v of values) {
    map.getOrCreate(keyer(v)).push(v);
  }
  return map;
}
