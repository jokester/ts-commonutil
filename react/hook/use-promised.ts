import { useState, useEffect } from 'react';

/**
 * A discriminated union to represent the result of a Promise
 * that can be destructured
 */
export type PromiseResult<T, E = unknown> = Readonly<
  | {
      pending: true;
      fulfilled: false;
      rejected: false;
    }
  | {
      pending: false;
      fulfilled: true;
      rejected: false;
      value: T;
    }
  | {
      pending: false;
      fulfilled: false;
      rejected: true;
      reason: E;
    }
>;

const pending: PromiseResult<any, any> = { pending: true, fulfilled: false, rejected: false };

export function usePromised<T>(promise: PromiseLike<T>): PromiseResult<T> {
  const [state, setState] = useState<PromiseResult<T>>(pending);

  useEffect(() => {
    let unmounted = false;
    if (!state.pending) setState(pending);

    promise.then(
      value => !unmounted && setState({ pending: false, fulfilled: true, rejected: false, value }),
      reason => !unmounted && setState({ pending: false, fulfilled: false, rejected: true, reason }),
    );

    return () => {
      unmounted = true;
    };
  }, [promise]);

  return state;
}
