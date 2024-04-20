import { sortBy } from './sortBy';

describe('orderBy', () => {
  it('sorts value DESC by "natural" JS ordering', () => {
    expect(sortBy([2, 3, 1], (v) => v)).toEqual([3, 2, 1]);
    expect(sortBy([1, 1, 2], (v) => v)).toEqual([2, 1, 1]);
  });
  it('sorts value ASC by "natural" JS ordering', () => {
    expect(sortBy([2, 3, 1], (v) => v, true)).toEqual([1, 2, 3]);
    expect(sortBy([1, 1, 2], (v) => v, true)).toEqual([1, 1, 2]);
  });
});
