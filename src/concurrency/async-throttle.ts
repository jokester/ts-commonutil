import { Deferred } from './deferred';

const immediate = Promise.resolve(0);

/**
 * @param func a supposedly idempotent function
 * @param wait
 */
export function asyncThrottle<T>(func: () => T | PromiseLike<T>, wait = 0): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    if (pending) {
      return pending;
    } else {
      pending = immediate.then(func);
      setTimeout(() => {
        pending = null;
      }, wait);
      return pending;
    }
  };
}

/**
 * @param func a supposedly idempotent function
 * @param wait
 */
export function asyncDebounce<T>(func: () => T | PromiseLike<T>, wait = 0): () => PromiseLike<T> {
  let pending: {
    count: number;
    resolved: Deferred<T>;
  } | null = null;

  return () => {
    const snapshot = (pending ??= {
      count: 0,
      resolved: new Deferred<T>(),
    });
    const thisCount = ++snapshot.count;

    setTimeout(() => {
      if (snapshot === pending && thisCount === snapshot.count) {
        pending = null;
        snapshot.resolved.fulfill(func());
      }
    }, wait);

    return snapshot.resolved;
  };
}
