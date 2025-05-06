import { defaultRng } from '../random/number';

export function sample<T>(input: readonly T[], rng = defaultRng): T {
  const index = Math.floor(input.length * rng());
  return input[index];
}

export function sampleSize<T>(from: readonly T[], count: number, rng = defaultRng): T[] {
  const reservoir: T[] = from.slice(0, Math.min(count, from.length));

  for (let i = count; i < from.length; i++) {
    const j = Math.floor(1 + rng() * i);
    if (j < count) {
      reservoir[j] = from[i];
    }
  }

  return reservoir;
}
