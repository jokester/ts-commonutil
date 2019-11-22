import { MinHeap } from './min-heap';
import { NumericOrder } from '../algebra/total-ordered';

describe('MinHeap', () => {
  it('insert elements', () => {
    const testee = new MinHeap(NumericOrder, 5);
    expect(testee.slice()).toEqual([]);

    expect(testee.insert(5).slice()).toEqual([5]);
    expect(testee.insert(2).slice()).toEqual([2, 5]);
    expect(testee.insert(1).slice()).toEqual([1, 5, 2]);
    expect(testee.insert(6).slice()).toEqual([1, 5, 2, 6]);
    expect(testee.insert(0).slice()).toEqual([0, 1, 2, 6, 5]);
  });

  it('pops element', () => {
    const testee = new MinHeap(NumericOrder, 5);
    testee
      .insert(5)
      .insert(2)
      .insert(1)
      .insert(6)
      .insert(0);

    expect(testee.pop()).toEqual(0);
    expect(testee.slice()).toEqual([1, 5, 2, 6]);
    expect(testee.pop()).toEqual(1);
    expect(testee.slice()).toEqual([2, 5, 6]);
    expect(testee.pop()).toEqual(2);
    expect(testee.pop()).toEqual(5);
    expect(testee.pop()).toEqual(6);
  });
});
