export function* chunk<T>(elements: Iterable<T>, chunkSize: number): Iterable<T[]> {
  let currentChunk: T[] = [];
  for (const e of elements) {
    currentChunk.push(e);
    if (currentChunk.length >= chunkSize) {
      yield currentChunk;
      currentChunk = [];
    }
  }
  if (currentChunk.length) {
    yield currentChunk;
  }
}

export function* chunkArray<T>(elements: readonly T[], chunkSize: number): Iterable<T[]> {
  for (let s = 0; ; s += chunkSize) {
    const chunk = elements.slice(s, s + chunkSize);
    if (!chunk.length) {
      break;
    }
    yield chunk;
  }
}
