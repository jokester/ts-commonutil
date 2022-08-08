import { useMemo } from 'react';
import { createFpsObservable } from '../../frontend/fps-observable';
import { useExternalObservable } from './use-observable-store';

export function useFps(windowSize: number): number {
  const observable = useMemo(() => createFpsObservable(windowSize), [windowSize]);
  return useExternalObservable(observable, -1);
}
