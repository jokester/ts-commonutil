export function wait<T = void>(delayMs: number, value?: T): Promise<T> {
  return new Promise<T>((f) => setTimeout(f, delayMs, value));
}

export function timeout<FakeRetType = never>(delayMs: number): Promise<FakeRetType> {
  return wait(delayMs).then((_) => {
    throw new Error(`timeout after ${delayMs}`);
  });
}

function neverResolve(): Promise<never> {
  return Never;
}

export const Never: Promise<never> = {
  then: neverResolve,
  catch: neverResolve,
  finally: neverResolve,
  [Symbol.toStringTag]: 'Never',
};

export const Doomed: PromiseLike<never> = {
  then(f1, f2) {
    return Promise.reject('Doomed').then(f1, f2);
  },
};

export async function withTimeout<T>(p: PromiseLike<T>, delayMs: number): Promise<T> {
  return Promise.race([p, timeout<T>(delayMs)]);
}

/**
 * @param minDuration in ms
 * @param io
 * @param waitOnException wait even if task() throws
 * @returns result of io()
 */
export async function withMinimumDuration<T>(
  minDuration: number,
  io: () => Promise<T>,
  waitOnException = true,
): Promise<T> {
  const start = Date.now();
  try {
    return await wait(minDuration, io());
  } catch (e) {
    if (waitOnException) {
      const elapsed = Date.now() - start;
      if (elapsed < minDuration) {
        await wait(minDuration - elapsed);
      }
    }
    throw e;
  }
}
