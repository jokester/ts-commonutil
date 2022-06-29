import { Observable } from 'rxjs';
import { useDeferredValue, useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react';

export function useExternalObservable<T>(observable: Observable<T>, defaultValue: T): T {
  const value = useRef<T>(defaultValue);
  const listener = useRef<null | (() => void)>(null);
  useEffect(() => {
    const s = observable.subscribe((next) => {
      value.current = next;
      listener.current?.();
    });

    return () => s.unsubscribe();
  }, [observable]);

  return useSyncExternalStore<T>(
    (onStoreChange) => {
      listener.current = onStoreChange;
      return () => (listener.current = null);
    },
    () => value.current,
    () => defaultValue,
  );
}

/**
 * @deprecated do not use: this is just slower
 * @nosideeffects
 */
function useTransitionObservable<T>(observable: Observable<T>, defaultValue: T): T {
  const [value, setValue] = useState(defaultValue);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const s = observable.subscribe((value) => {
      startTransition(() => setValue(value));
    });

    return () => s.unsubscribe();
  }, [observable]);

  return useDeferredValue(value);
}

/**
 * @deprecated reactSubscriber can't be used for rx cold observables
 * @nosideeffects
 */
function useBrokenExternalObservable<T>(source: Observable<T>, defaultValue: T): T {
  const lastEvent = useRef<T>(defaultValue);
  return useSyncExternalStore<T>(
    (reactSubscriber) => {
      console.debug('ExternalStoreViewer subscribing');
      const s = source.subscribe({
        next: (v) => {
          lastEvent.current = v;
          console.debug('ExternalStoreViewer submitting', v);
          reactSubscriber();
        },
        error: (error) => {
          console.debug('ExternalStoreViewer error', error);
        },
        complete: () => {
          console.debug('ExternalStoreViewer complete');
        },
      });

      return () => {
        console.debug('ExternalStoreViewer unsubscribing');
        s.unsubscribe();
      };
    },
    () => lastEvent.current,
    () => defaultValue,
  );
}
