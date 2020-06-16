export function wait<T = void>(delayMs: number, value?: T): Promise<T> {
  return new Promise<T>(f => setTimeout(f, delayMs, value));
}

export function timeout<FakeRetType = never>(delayMs: number): Promise<FakeRetType> {
  return wait(delayMs).then(_ => {
    throw new Error(`timeout after ${delayMs}`);
  });
}

function neverResolve() {
  return Never;
}

export const Never: Promise<any> = {
  then: neverResolve,
  catch: neverResolve,
  finally: neverResolve,
  [Symbol.toStringTag]: `Never`,
};

export const Doomed: PromiseLike<any> = {
  then(f1, f2) {
    return Promise.reject('Doomed').then(f1, f2);
  },
};

export async function withTimeout<T>(p: PromiseLike<T>, delayMs: number): Promise<T> {
  return Promise.race([p, timeout<T>(delayMs)]);
}

/**
 * @param {number} minimumPeriod
 * @param {() => Promise<T>} task
 * @param waitOnException {boolean=true} wait even if task() throws
 * @returns {Promise<T>}
 */
export async function withMinimumDuration<T>(
  minimumPeriod: number,
  task: () => Promise<T>,
  waitOnException = true,
): Promise<T> {
  try {
    return wait(minimumPeriod, task());
  } catch (e) {
    if (waitOnException) await wait(minimumPeriod);
    throw e;
  }
}
