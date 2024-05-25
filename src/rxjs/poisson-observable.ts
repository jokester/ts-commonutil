import { Observable, Subscriber } from 'rxjs';
import { wait } from '../concurrency/timing';
import { defaultRng } from '../random/number';

/**
 * @param {number} lambda expected occurrence rate in {@code $ s^{-1} $ }
 * @param rng random number generator
 * @returns A cold observable that emits 0-based integers, at Poissonic random interval
 */
export function poissonObservable(lambda = 1, rng = defaultRng): Observable<number> {
  return new Observable<number>((subscriber) => {
    setTimeout(() => postPoissonEvents(subscriber, lambda, () => subscriber.closed));
  });
}
/**
 * @internal
 */
async function postPoissonEvents(
  subscriber: Subscriber<number>,
  lambda: number,
  shouldStop: () => boolean,
  rng = defaultRng,
): Promise<void> {
  let eventNo = 0;
  while (true) {
    const poissonDelay = (-1 / lambda) * Math.log(rng()) * 1e3;
    await wait(poissonDelay);
    if (shouldStop()) break;
    subscriber.next(eventNo++);
  }
}
