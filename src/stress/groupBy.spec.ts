import { groupBy } from './groupBy';

describe(groupBy, () => {
  it('groups value with provided keyer()', () => {
    expect(groupBy([], () => 0)).toEqual({});
    expect(groupBy(new Set([1, 2, 4]), (v) => v % 2)).toEqual({
      1: [1],
      0: [2, 4],
    });
  });
});
