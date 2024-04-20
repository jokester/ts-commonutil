function* reduce<A, B>(
  iterable: Iterable<A>,
  reduce: (a: A, b: B) => B,
  initial: B,
  yieldInitial = true,
): Generator<B> {
  let b = initial;
  if (yieldInitial) {
    yield b;
  }
  for (const a of iterable) {
    yield (b = reduce(a, b));
  }
}

async function* reduceAsync<A, B>(
  iterable: GeneralIterable<A>,
  reduce: (a: A, b: B) => MaybePromise<B>,
  initial: MaybePromise<B>,
  yieldInitial = true,
): AsyncGenerator<B> {
  let t = await initial;
  if (yieldInitial) {
    yield t;
  }
  for await (const a of iterable) {
    t = await reduce(a, t);
    yield t;
  }
}

function* filter<T>(iterable: Iterable<T>, predicate: (value: T) => boolean): Generator<T> {
  for (const v of iterable) if (predicate(v)) yield v;
}

async function* filterAsync<T>(
  iterable: GeneralIterable<T>,
  predicate: (value: T) => MaybePromise<T>,
): AsyncGenerator<T> {
  for await (const v of iterable) if (await predicate(v)) yield v;
}

function* map<T, S>(iterable: Iterable<T>, mapper: (value: T) => S): Generator<S> {
  for (const v of iterable) yield mapper(v);
}

async function* mapAsync<T, S>(iterable: GeneralIterable<T>, mapper: (value: T) => MaybePromise<S>): AsyncGenerator<S> {
  for await (const a of iterable) yield await mapper(a);
}

function find<T>(iterator: Iterable<T>, predicate: (value: T) => unknown, onAbsent: () => T): T {
  for (const i of iterator) {
    if (predicate(i)) return i;
  }
  return onAbsent();
}

function* fromIterator<T>(iterator: Iterator<T>): Generator<T> {
  while (true) {
    const x = iterator.next();
    if (x.done) {
      break;
    }
    yield x.value;
  }
}

async function findAsync<T>(
  iterator: GeneralIterable<T>,
  predicate: (t: T) => MaybePromise<unknown>,
  onAbsent: () => MaybePromise<T>,
): Promise<T> {
  for await (const t of iterator) {
    if (await predicate(t)) return t;
  }
  return onAbsent();
}

export const Iterables = {
  reduce,
  reduceAsync,
  filter,
  filterAsync,
  map,
  mapAsync,
  find,
  findAsync,
} as const;

type GeneralIterable<T> = Iterable<T> | AsyncIterable<T>;
type MaybePromise<T> = T | PromiseLike<T>;

export function toMap<T, K>(items: Iterable<T>, keyer: (t: T) => K): Map<K, T> {
  const ret = new Map<K, T>();
  for (const i of items) {
    ret.set(keyer(i), i);
  }
  return ret;
}
