import { useEffect, useRef } from 'react';

const defaultIgnore = (v1: unknown, v2: unknown) => Object.is(v1, v2);

export function usePrev<T>(value: T, shouldIgnore: (last: T, current: T) => boolean = defaultIgnore) {
  const ref = useRef(value);

  useEffect(() => {
    if (!shouldIgnore(ref.current, value)) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
}
