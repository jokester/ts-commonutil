/**
 * Fast computation for (a ⊗ k), when (a ⊕ b) forms a monoid
 *
 * @ref https://jokester.io/post/2017-03/monoid-fast-exp/
 */
export function fastMul<T>(id: T, mplus: (op1: T, op2: T) => T, a: T, k: number): T {
    if (typeof k !== "number"
        || k < 0
        || isNaN(k)
        || Math.floor(k) !== k)
        throw new Error("exp must be positive integer");

    let ans = id;

    while (k > 0) {
        if (k % 2 == 1) {
            ans = mplus(ans, a);
            k--;
        } else {
            a = mplus(a, a);
            k /= 2;
        }
    }

    return ans;
}
