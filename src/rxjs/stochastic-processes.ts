import { Observable, from, timer, Subscriber } from 'rxjs';
import { gaussianRandom } from './distributions';
import { wait } from '../concurrency/timing';

export function bernoulli(p: number): Observable<boolean> {
  return from(function*() {
    while (true) {
      yield Math.random() < p;
    }
  });
}

export function wiener(dt = 1): Observable<number> {
  return from(function*() {
    let sum = 0;
    yield sum;
    while (true) {
      const d = Math.sqrt(dt) * gaussianRandom();
      yield (sum += d);
    }
  });
}

/**
 * @param {number} lambda expected occurrence rate in {@code $ s^{-1} $ }
 * @returns {Observable<number>} A observable that emits 0-based integers at Poissonic random interval
 */
export function poisson(lambda = 1): Observable<number> {
  return new Observable<number>(subscriber => {
    let subscribed = true;

    setTimeout(() => postPoissonEvents(subscriber, lambda, () => subscriber.closed));

    return (): void => {
      subscribed = false;
    };
  });
}

/**
 * @internal
 */
async function postPoissonEvents(
  subscriber: Subscriber<number>,
  lambda: number,
  shouldStop: () => boolean,
): Promise<void> {
  let eventNo = 0;
  while (true) {
    const poissonDelay = (-1 / lambda) * Math.log(Math.random()) * 1e3;
    await wait(poissonDelay);
    if (shouldStop()) break;
    subscriber.next(eventNo++);
  }
}
