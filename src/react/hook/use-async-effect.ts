import { RefObject, useEffect, DependencyList } from 'react';
import { Deferred } from '../../concurrency/deferred';

const nextTick = Promise.resolve();

export function useAsyncEffect(
  effectCallback: (
    running: RefObject<boolean>,
    released: PromiseLike<void>,
  ) => Promise</* cleanup should be done with released */ void>,
  deps?: DependencyList,
  preventDuplicatedRun = false,
): void {
  useEffect(() => {
    const mounted = { current: true };

    const effectReleased = new Deferred<void>(true);

    const run = preventDuplicatedRun
      ? async () => {
          await nextTick;
          if (!mounted.current) return;
          return effectCallback(mounted, effectReleased);
        }
      : () => effectCallback(mounted, effectReleased);
    if (typeof setImmediate === 'function') {
      setImmediate(run);
    } else {
      setTimeout(run);
    }

    return () => {
      effectReleased.fulfill();
      mounted.current = false;
    };
  }, deps);
}
