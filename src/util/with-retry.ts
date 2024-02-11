import { wait } from '../concurrency/timing';

interface RetryOptions {
  /**
   * defaults to 3
   */
  maxAttempts?: number;

  /**
   * callback on error
   * return truthy to break on errors beyond save
   */
  shouldBreak?(error: unknown): boolean | PromiseLike<boolean>;
  /**
   * callback before 2nd attempt and on
   * defaults to be exponential delay (0.1s, 0.2s, 0.4s, ...) , plus a random jitter between 0 and 0.1s
   * @param tried 1, 2, ...
   */
  delayBeforeRetry?(tried: number): number;
}

function defaultDelayBeforeRetry(tried: number): number {
  // 1, 2, ... but no more than 50
  const multiplier = Math.min(2 ** (tried - 2), 50);
  return (multiplier + Math.random()) * 0.1e3;
}

export async function withRetry<T>(
  io: () => PromiseLike<T>,
  { maxAttempts = 3, shouldBreak, delayBeforeRetry = defaultDelayBeforeRetry }: RetryOptions,
): Promise<T> {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await io();
    } catch (e) {
      if (shouldBreak && (await shouldBreak(e))) {
        throw e;
      }
      if (i === maxAttempts) {
        throw e;
      }
      await wait(delayBeforeRetry(i)); // and continue
    }
  }
  throw new Error(`should not be here`);
}
