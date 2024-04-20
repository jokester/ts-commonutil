import { Multiset } from './multiset';

describe(Multiset, () => {
  it('keeps elements and count', () => {
    const testee = new Multiset<string>();

    testee.setCount('abc', 1);
    testee.setCount('abc', 2);
    testee.setCount('abd', 1);

    expect(testee.getCount('abc')).toEqual(2);
    expect(testee.findByCount(1)).toEqual(['abd']);
    expect(testee.findByCount(2)).toEqual(['abc']);
    expect(testee.findByCount(0)).toEqual([]);

    testee.setCount('abc', 0);
    testee.setCount('abc', 1);
    testee.setCount('abc', 1);
    testee.setCount('abc', 0);
    expect(testee.maxCount()).toBe(1);
    expect(testee.getCount('abc')).toEqual(0);
    expect(testee.getCount('abd')).toEqual(1);
    expect(testee.findByCount(0)).toEqual(['abc']);

    testee.shrink();
    testee.shrink();
    expect(testee.findByCount(0)).toEqual([]);
    testee.touch('abc');
    testee.touch('abd');
    expect(testee.findByCount(0)).toEqual(['abc']);
    expect(testee.findByCount(1)).toEqual(['abd']);

    expect(testee.getCount('abf')).toEqual(0);
  });
});
