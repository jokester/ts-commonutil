import { Iterables } from './iterables';

function fromIterable<T>(items: Iterable<T>) {
  const r = new Set<T>();

  for (const t of items) r.add(t);

  return r;
}

function intersect<T>(as: ReadonlySet<T>, bs: ReadonlySet<T>): Set<T> {
  return fromIterable(Iterables.filter(as, _ => bs.has(_)));
}

export const Sets = {
  fromIterable,
} as const;
