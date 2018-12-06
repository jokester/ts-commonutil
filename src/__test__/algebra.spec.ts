import { fastMul, Monoid } from "../algebra/monoid";

describe("fastMul", () => {
  it("add on integer forms a monoid", () => {
    const intPlus: Monoid<number> = {
      id: 0,
      mPlus: (a, b) => a + b,
    };
    expect(fastMul(intPlus, 5, 10))
      .toEqual(50);
  });

  it("mul on integer forms a monoid", () => {

    const intMul: Monoid<number> = {
      id: 1,
      mPlus: (a, b) => a * b,
    };
    expect(fastMul(intMul, 5, 6))
      .toEqual(Math.pow(5, 6));
  });

  it("(add then mod) on integer forms a monoid", () => {
    const mod1999: Monoid<number> = {
      id: 0,
      mPlus: (a, b) => ((a % 1999) + (b % 1999)) % 1999,
    };

    // correct result: 1801430843748943459009 % 1193
    expect(fastMul(mod1999, Number.MAX_SAFE_INTEGER, 199999)).toEqual(1193);

    // a incorrect result due to overflow
    expect(199999 * Number.MAX_SAFE_INTEGER % 1999).toEqual(1017);
  });
});
