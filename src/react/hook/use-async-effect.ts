import { RefObject, useRef, useEffect, DependencyList } from 'react';

export function useAsyncEffect(
  effectCallback: (mounted: RefObject<boolean>) => Promise<unknown>,
  deps?: DependencyList,
): void {
  useEffect(() => {
    const mounted = { current: true };

    if (typeof setImmediate === 'function') {
      setImmediate(() => effectCallback(mounted));
    } else {
      setTimeout(() => effectCallback(mounted));
    }

    return () => {
      mounted.current = false;
    };
  }, deps);
}
