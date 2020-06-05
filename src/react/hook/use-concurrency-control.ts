import { useMounted } from './use-mounted';
import { useCallback, useState } from 'react';

const inc = (_: number) => _ + 1;
const dec = (_: number) => _ - 1;

export function useConcurrencyControl(maxConcurrency = 1) {
  const mounted = useMounted();
  /**
   * using useState instead of useRef: UI may infer pending/blocked from it
   */
  const [running, setRunning] = useState(0);

  const runWithLock = useCallback(
    <T>(foo: (m: typeof mounted) => Promise<T>): Promise<T> => {
      if (mounted.current && running < maxConcurrency) {
        setRunning(inc);
        return foo(mounted).finally(() => mounted.current && setRunning(dec));
      }
      return Promise.reject('max concurrency exceeded');
    },
    [running, maxConcurrency],
  );

  return [runWithLock, running] as const;
}
