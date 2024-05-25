import { defaultRng, gaussianRandom } from './number';

export function* bernoulliSeries(p: number, rng = defaultRng): Generator<boolean, void> {
  while (true) yield rng() < p;
}

export function* wienerSeries(dt: number, rng = defaultRng): Generator<number, void> {
  let sum = 0;
  yield sum;
  while (true) {
    const d = Math.sqrt(dt) * gaussianRandom(rng);
    yield (sum += d);
  }
}
