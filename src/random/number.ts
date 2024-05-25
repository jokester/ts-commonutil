export const defaultRng = Math.random;

function sample<T>(from: ReadonlyArray<T>, count: number, rng = defaultRng): T[] {
  const sampled: T[] = from.slice(0, count); // 'reservoir'

  for (let i = count; i < from.length; i++) {
    const j = Math.floor(1 + Math.random() * i);
    if (j < count) {
      sampled[j] = from[i];
    }
  }

  return sampled;
}

export function binomialRandom(n: number, p: number, rng = defaultRng): number {
  let s = 0;
  for (let sample = 0; sample < n; ++sample) {
    if (rng() <= p) ++s;
  }
  return s;
}

export function gaussianRandom(rng = defaultRng): number {
  const u1 = rng(),
    u2 = rng();

  // basic form of Box-Muller transform
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
