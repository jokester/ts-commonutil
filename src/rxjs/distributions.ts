export function binomialRandom(n: number, p: number): number {
  let s = 0;
  for (let sample = 0; sample < n; ++sample) {
    if (Math.random() <= p) ++s;
  }
  return s;
}

export function gaussianRandom(): number {
  const u1 = Math.random(),
    u2 = Math.random();

  // basic form of Box-Muller transform
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
