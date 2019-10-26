import { useState, useEffect } from 'react';

/**
 * A discriminated union to represent the result of a Promise
 * that can be destructured
 */
export type PromiseResult<T> = Readonly<
  | { pending: true; fulfilled?: undefined; rejected?: undefined }
  | { pending?: undefined; fulfilled: true; rejected?: undefined; value: T }
  | { pending?: undefined; fulfilled?: undefined; rejected: true; reason: unknown }
>;

const pending: PromiseResult<any> = { pending: true };

export function usePromised<T>(promise: PromiseLike<T>): PromiseResult<T> {
  const [state, setState] = useState<PromiseResult<T>>(pending);

  useEffect(() => {
    let unmounted = false;
    if (!state.pending) setState(pending);

    promise.then(
      value => !unmounted && setState({ fulfilled: true, value }),
      reason => !unmounted && setState({ rejected: true, reason }),
    );

    return () => {
      unmounted = true;
    };
  }, [promise]);

  return state;
}
