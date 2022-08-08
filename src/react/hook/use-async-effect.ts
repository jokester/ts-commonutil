import { RefObject, useRef, useEffect, DependencyList } from 'react';
import { Deferred } from '../../concurrency/deferred';

export function useAsyncEffect(
  effectCallback: (mounted: RefObject<boolean>, effectReleased: PromiseLike<void>) => Promise<unknown>,
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
