import { Multiset } from './multiset';

describe(Multiset, () => {
  it('keeps elements and count', () => {
    const testee = new Multiset<string>();

    testee.setCount('abc', 1);
    testee.setCount('abc', 2);

    expect(testee.getCount('abc')).toEqual(2);
    expect(testee.getElemsOfCount(1)).toEqual([]);
    expect(testee.getElemsOfCount(2)).toEqual(['abc']);
    expect(testee.getElemsOfCount(0)).toEqual([]);

    testee.setCount('abc', 0);
    testee.setCount('abc', 0);
    expect(testee.maxCount()).toEqual(0);
    expect(testee.getCount('abc')).toEqual(0);
    expect(testee.getElemsOfCount(0)).toEqual([]);
  });
});
