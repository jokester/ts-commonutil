import React, { useEffect, useState } from 'react';
import { Notification, Observable } from 'rxjs';
import { materialize } from 'rxjs/operators';

type Props<T> = React.PropsWithChildren<{
  observable: Observable<T>;
  placeholder: T;
  children(lastValue: T): React.ReactNode;
  renderError?(err: unknown): React.ReactNode;
  renderComplete?(): React.ReactNode;
  onError?(err: unknown): void;
  onComplete?(): void;
  onValue?(value: T): void;
}>;

function renderNothing(): React.ReactNode {
  return null;
}

export function Streamed<T>(props: Props<T>): React.ReactElement | null {
  const [n, setN] = useState<Notification<T>>(() => new Notification<T>('N', props.placeholder));

  useEffect(() => {
    // console.log('subscribed');
    const subscription = props.observable.pipe(materialize()).subscribe((value) => {
      setN(value);

      value.do(props.onValue || renderNothing, props.onError, props.onComplete);
    });

    return () => {
      // console.log('unsubscribed');
      subscription.unsubscribe();
    };
  }, [props.observable]);

  const { children, renderComplete = renderNothing, renderError = renderNothing } = props;

  // console.log('rendered', n);

  return n.do(children, renderError, renderComplete) || null;
}
