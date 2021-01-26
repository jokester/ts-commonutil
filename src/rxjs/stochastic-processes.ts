import { Observable, from, timer } from 'rxjs';
import { gaussianRandom } from './distributions';
import { concatMap, mergeMap } from 'rxjs/operators';
import { Subscribable } from 'rxjs/src/internal/types';
import { wait } from '../concurrency/timing';

export function bernoulli(p: number): Observable<boolean> {
  return from(function*() {
    while (true) {
      yield Math.random() < p;
    }
  });
}

export function wiener(dt = 1): Observable<number> {
  let sum = 0;
  return from(function*() {
    yield sum;
    while (true) {
      const d = Math.sqrt(dt) * gaussianRandom();
      yield (sum += d);
    }
  });
}

export function poisson(lambda = 1): Observable<void> {
  const intervals = from(function*() {
    yield -Math.log(Math.random()) / lambda;
  });
  // FIXME
  if (1) throw 'not usable';
  return intervals.pipe(mergeMap(interval => delayed(interval)));
}

function delayed(delay: number): Observable<void> {
  return from(wait(delay));
}
