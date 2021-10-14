import type { Monoid } from 'fp-ts/Monoid';

/**
 * (integer-powered) power function on monoid
 * @param monoid
 * @see https://jokester.io/post/2017-03/monoid-fast-exp/
 */
export const monoidPow =
  <T>(monoid: Monoid<T>) =>
  (value: T, power: number): T => {
    let p = power >>> 0;
    let current: T = monoid.empty;
    let factor: T = value;

    while (p) {
      if (p % 2) {
        current = monoid.concat(current, factor);
      }
      factor = monoid.concat(factor, factor);
      p >>= 1;
    }

    return current;
  };
