export function wait(delayMs: number) {
  return new Promise<void>(f => setTimeout(f, delayMs));
}

export function timeout<FakeRetType = never>(delayMs: number) {
  return new Promise<FakeRetType>((f, e) => setTimeout(e, delayMs, new Error(`timeout after ${delayMs}`)));
}

export async function withTimeout<T>(p: PromiseLike<T>, delayMs: number): Promise<T> {
  return Promise.race([p, timeout<T>(delayMs)]);
}

export async function withMinimumDuration<T>(minimumPeriod: number, task: () => Promise<T>): Promise<T> {
  const start = Date.now();

  try {
    return await task();
  } finally {
    const elapsed = Date.now() - start;
    if (elapsed < minimumPeriod) {
      await wait(minimumPeriod - elapsed);
    }
  }
}
