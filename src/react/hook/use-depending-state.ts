import { useEffect, useRef, useState } from 'react';

/**
 * @deprecated prefer recreation with key={}
 * @param {F} initialize
 * @param {Parameters<F>} deps
 * @returns {readonly [T, <T>(value: ((<T>(prevState: T) => T) | T)) => void]}
 */
export function useDependingState<T, F extends (...args: any) => T = (...args: any) => any>(
  initialize: F,
  deps: Parameters<F>,
) {
  const isFirstRun = useRef(true);
  const [state, setState] = useState<T>(() => initialize.call(null, deps));
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      setState(initialize.call(null, deps));
    }
  }, deps);
  return [state, setState] as const;
}
