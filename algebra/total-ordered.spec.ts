import { NumericOrder, TotalOrdered } from './total-ordered';

describe('NumberTotalOrdered', () => {
  it('sorts integer', () => {
    expect(NumericOrder.sort([])).toEqual([]);

    expect(NumericOrder.sort([1, 2, 3])).toEqual([1, 2, 3]);
    expect(NumericOrder.sort([4, 6, 5])).toEqual([4, 5, 6]);
  });
});
