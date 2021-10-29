import React from 'react';
import { usePromised } from '../hook/use-promised';

interface RenderPromiseProps<T> extends React.PropsWithChildren<Record<never, unknown>> {
  promise: Promise<T>;
  onPending?(): React.ReactElement;
  onReject?(e: unknown): React.ReactElement;
  children(value: T): null | React.ReactElement;
}

export function RenderPromise<T>(props: RenderPromiseProps<T>): React.ReactElement {
  const promised = usePromised(props.promise);

  if (promised.fulfilled) {
    return props.children(promised.value) as React.ReactElement;
  } else if (promised.pending) {
    return (props.onPending?.() || null) as React.ReactElement;
  } else {
    return (props.onReject?.(promised.reason) || null) as React.ReactElement;
  }
}
