function fromIterable<T, K>(items: Iterable<T>, hash: (t: T) => K): Map<K, T> {
  const ret = new Map<K, T>();
  for (const i of items) {
    ret.set(hash(i), i);
  }
  return ret;
}

export const Maps = {
  buildMap: fromIterable,
} as const;
