import { monoidPow } from './monoid';
import { number } from 'fp-ts';
import { Monoid } from 'fp-ts/Monoid';

describe(monoidPow, () => {
  it('computes multiply when monoid is sum', () => {
    let callCount = 0;
    const mockedSum: Monoid<number> = {
      empty: 0,
      concat: (a, b) => {
        ++callCount;
        return a + b;
      },
    };

    const ourProduct = monoidPow(mockedSum);

    for (const pow of [1, 2, 5, 10, 20, 50, 1e4, 1e6, 1e9, 2e9]) {
      expect(ourProduct(3, pow)).toEqual(3 * pow);
      expect(callCount).toBeLessThanOrEqual(2 + 2 * Math.log2(pow));

      callCount = 0;
    }
  });

  it('computes pow() when monoid is product', () => {
    expect(monoidPow(number.MonoidProduct)(2, 4))
      //
      .toEqual(Math.pow(2, 4));
  });
});
