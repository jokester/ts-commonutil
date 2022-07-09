import { Observable } from 'rxjs';

const defaultGetTimestamp = () => Date.now();

/**
 *
 * @param windowSize
 * @param getTime {() => number} a callback that returns millisecond timestamp. defaults to Date.now()
 */
export function createFpsObservable(windowSize = 60, getTime = defaultGetTimestamp): Observable<number> {
  return new Observable<number>((subscriber) => {
    const times: number[] = [];

    const onRaf = () => {
      if (!subscriber.closed) {
        const t = getTime();
        times.push(t);

        if (windowSize > 0 && times.length > windowSize) {
          const t0 = times.shift()!;
          const fps = windowSize / ((t - t0) / 1e3);
          subscriber.next(fps);
        }

        requestAnimationFrame(onRaf);
      }
    };

    requestAnimationFrame(onRaf);
  });
}
