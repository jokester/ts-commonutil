export const defaultRng = Math.random;

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
