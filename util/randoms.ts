function sample<T>(from: ReadonlyArray<T>, count: number): T[] {
  const sampled: T[] = from.slice(0, count); // 'reservoir'

  for (let i = count; i < from.length; i++) {
    const j = Math.floor(1 + Math.random() * i);
    if (j < count) {
      sampled[j] = from[i];
    }
  }

  return sampled;
}

export const Randoms = {
  sample,
};
