import { useState, useEffect } from 'react';

/**
 * A discriminated union to represent the result of a Promise
 * that can be destructured
 */
export type PromiseResult<T, E = unknown> = Readonly<
  | {
      pending: true;
      fulfilled: null;
      rejected: null;
    }
  | {
      pending: null;
      fulfilled: true;
      rejected: null;
      value: T;
    }
  | {
      pending: null;
      fulfilled: null;
      rejected: true;
      reason: E;
    }
>;

const pending: PromiseResult<any, any> = { pending: true, fulfilled: null, rejected: null };

export function usePromised<T>(promise: PromiseLike<T>): PromiseResult<T> {
  const [state, setState] = useState<PromiseResult<T>>(pending);

  useEffect(() => {
    let unmounted = false;
    if (!state.pending) setState(pending);

    promise.then(
      value => !unmounted && setState({ pending: null, fulfilled: true, rejected: null, value }),
      reason => !unmounted && setState({ pending: null, fulfilled: null, rejected: true, reason }),
    );

    return () => {
      unmounted = true;
    };
  }, [promise]);

  return state;
}
