import { Deferred } from './deferred';

const immediate = Promise.resolve(0);

/**
 * @param func a function
 * @param cacheWindow the time to cache result of `func`, in ms
 * @return a wrapper function that caches return value of `func`, and only call `func` at most once every `cacheWindow` ms
 */
export function asyncThrottle<T>(func: () => T | PromiseLike<T>, cacheWindow: number): () => Promise<T> {
  let pending: Promise<T> | null = null;
  return () => {
    if (pending) {
      return pending;
    } else {
      // not taking a snapshot to compare-and-swap, because there should be no race condition
      pending = immediate.then(func);
      setTimeout(() => {
        pending = null;
      }, cacheWindow);
      return pending;
    }
  };
}

/**
 * @param func a function
 * @param waitWindow the time to wait before calling `func`, in ms
 * @return a wrapper function that only call `func` if itself is not called again within `waitWindow` ms
 */
export function asyncDebounce<T>(func: () => T | PromiseLike<T>, waitWindow: number): () => PromiseLike<T> {
  let pending: {
    count: number;
    resolved: Deferred<T>;
  } | null = null;

  return () => {
    const snapshot = (pending ||= {
      count: 0,
      resolved: new Deferred<T>(),
    });
    const thisCount = ++snapshot.count;

    setTimeout(() => {
      if (snapshot === pending && thisCount === snapshot.count) {
        pending = null;
        snapshot.resolved.fulfill(func());
      }
    }, waitWindow);

    return snapshot.resolved;
  };
}

/**
 * like `asyncDebounce`, but with a `waitLimit` .
 * i.e. call to original `func` will not be delayed indefinitely.
 * `waitWindow` is effectively the minimal interval to call `func`
 * @param func
 * @param waitWindow
 * @param waitLimit
 */
export function asyncDebounceWithLimit<T>(func: () => T | PromiseLike<T>, waitWindow: number, waitLimit: number) {
  throw new Error('not implemented');
}
