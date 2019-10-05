import { useState, useEffect } from 'react';

type PromiseResult<T> =
  | { pending: true; fulfilled?: void; rejected?: void }
  | { pending?: void; fulfilled: true; rejected?: void; value: T }
  | { pending?: void; fulfilled?: void; rejected: true; reason: unknown };

const pending: PromiseResult<any> = { pending: true };

export function usePromised<T>(promise: PromiseLike<T>) {
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
