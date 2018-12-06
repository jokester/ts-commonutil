export interface Monoid<T> {
  // left & right identity
  readonly id: T;
  readonly mplus: (a1: T, a2: T) => T;
}

/**
 * Fast computation for (a ⊗ k), when (a ⊕ b) forms a monoid
 *
 * @see https://jokester.io/post/2017-03/monoid-fast-exp/
 */
export function fastMul<T>(id: T, mplus: (op1: T, op2: T) => T, a: T, k: number): T {
  if ((k >>> 0) !== k || !(k > 0)) {
    throw new Error("exp must be positive integer");
  }

  let ans = id;
  let r = k;

  while (r > 0) {
    if (r % 2 === 1) {
      ans = mplus(ans, a);
      r--;
    } else {
      ans = mplus(a, a);
      r /= 2;
    }
  }

  return ans;
}
