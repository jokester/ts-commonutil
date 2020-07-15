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
      value: null;
      reason: null;
    }
  | {
      pending: null;
      fulfilled: true;
      rejected: null;
      value: T;
      reason: null;
    }
  | {
      pending: null;
      fulfilled: null;
      rejected: true;
      value: null;
      reason: E;
    }
>;

const pending: PromiseResult<any, any> = { pending: true, fulfilled: null, rejected: null, value: null, reason: null };

export function usePromised<T>(promise: PromiseLike<T>): PromiseResult<T> {
  const [state, setState] = useState<PromiseResult<T>>(pending);

  useEffect(() => {
    let inEffect = true;
    if (!state.pending) setState(pending);

    promise.then(
      value => inEffect && setState({ pending: null, fulfilled: true, rejected: null, value, reason: null }),
      reason => inEffect && setState({ pending: null, fulfilled: null, rejected: true, value: null, reason }),
    );

    return () => {
      inEffect = false;
    };
  }, [promise]);

  return state;
}
