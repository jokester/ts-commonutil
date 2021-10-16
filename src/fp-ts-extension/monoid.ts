import type { Monoid } from 'fp-ts/Monoid';

/**
 * (integer-powered) power function on monoid
 * @param monoid
 * @see https://jokester.io/post/2017-03/monoid-fast-exp/
 */
export const monoidPow =
  <T>(monoid: Monoid<T>) =>
  (value: T, power: number): T => {
    if (!(power >>> 0 === power && Math.log2(power) < 52)) {
      throw new Error(`power too big: ${power}`);
    }
    let current: T = monoid.empty;
    /**
     * invariant: factor = value ** p
     */
    let factor: T = value;
    let p = 1;

    while (p <= power) {
      if (p & power) {
        current = monoid.concat(current, factor);
      }

      factor = monoid.concat(factor, factor);
      p *= 2;
    }

    return current;
  };
