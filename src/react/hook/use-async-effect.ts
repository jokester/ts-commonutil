import { RefObject, useEffect, DependencyList } from 'react';
import { Deferred } from '../../concurrency/deferred';

export function useAsyncEffect(
  effectCallback: (
    running: RefObject<boolean>,
    released: PromiseLike<void>,
  ) => Promise</* cleanup should be done with released */ void>,
  deps?: DependencyList,
): void {
  useEffect(() => {
    const mounted = { current: true };

    const effectReleased = new Deferred<void>(true);

    if (typeof setImmediate === 'function') {
      setImmediate(() => effectCallback(mounted, effectReleased));
    } else {
      setTimeout(() => effectCallback(mounted, effectReleased));
    }

    return () => {
      effectReleased.fulfill();
      mounted.current = false;
    };
  }, deps);
}
