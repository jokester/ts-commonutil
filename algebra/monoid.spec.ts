import { fastMul, Monoid } from "./monoid";


describe("fastMul", () => {
    it("add on integer forms a monoid", () => {
        const Monoid: Monoid<number> = {
            id: 0,
            mplus: (a, b) => a + b
        };
        expect(fastMul(Monoid.id, Monoid.mplus, 5, 10))
            .toEqual(50);
    });

    it("mul on integer forms a monoid", () => {

        const Monoid: Monoid<number> = {
            id: 1,
            mplus: (a, b) => a * b
        };
        expect(fastMul(Monoid.id, Monoid.mplus, 5, 6))
            .toEqual(Math.pow(5, 6));
    });

    it("(add then mod) on integer forms a monoid", () => {
        const Monoid: Monoid<number> = {
            id: 0,
            mplus: (a, b) => ((a % 1999) + (b % 1999)) % 1999
        };

        // correct result: 1801430843748943459009 % 1193
        expect(fastMul(Monoid.id, Monoid.mplus, Number.MAX_SAFE_INTEGER, 199999)).toEqual(1193);

        // a incorrect result due to overflow
        expect(199999 * Number.MAX_SAFE_INTEGER % 1999).toEqual(1017);
    });
});
