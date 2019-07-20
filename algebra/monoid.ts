export interface Monoid<T> {
  // left & right identity
  readonly id: T;
  readonly mPlus: (a1: T, a2: T) => T;
}

/**
 * Fast computation for (a ⊗ k), when (a ⊕ b) forms a monoid
 *
 * @see https://jokester.io/post/2017-03/monoid-fast-exp/
 */
export function fastMul<T>(monoid: Monoid<T>, a: T, pow: number): T {
  if (pow >>> 0 !== pow || !(pow > 0)) {
    throw new Error('exp must be positive integer');
  }

  const { id, mPlus } = monoid;

  let ans = id;
  let f = a;
  let p = pow;

  while (p > 0) {
    if (p % 2) {
      ans = mPlus(ans, f);
      p--;
    } else {
      f = mPlus(f, f);
      p /= 2;
    }
  }

  return ans;
}
