import { RefObject, useEffect, DependencyList } from 'react';
import { Deferred } from '../../concurrency/deferred';

const nextTick = Promise.resolve();

export function useAsyncEffect(
  effectCallback: (
    running: RefObject<boolean>,
    released: PromiseLike<void>,
    abortSignal: AbortSignal,
  ) => Promise</* cleanup should be done with released */ void>,
  deps?: DependencyList,
): void {
  useEffect(() => {
    const mounted = { current: true };
    const effectReleased = new Deferred<void>(true);
    let abortController: AbortController = null!;
    try {
      if (effectCallback.length >= 3) {
        abortController = new AbortController();
      }
    } catch (ignored: unknown) {}
    nextTick
      .then(() => {
        if (!mounted.current) return;
        return effectCallback(mounted, effectReleased, abortController?.signal);
      })
      .catch((e) => {
        console.error('useAsyncEffect error', e);
      });

    return () => {
      effectReleased.fulfill(undefined);
      mounted.current = false;
      abortController?.abort();
    };
  }, deps);
}
