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
    const testee = new MinHeap(NumericOrder, 5)
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
    expect(testee.pop()).toEqual(undefined);
    expect(testee.slice()).toEqual([]);
  });

  it('pops element - 2', () => {
    const testee = new MinHeap(NumericOrder, 5)
      .insert(0)
      .insert(2)
      .insert(3)
      .insert(100)
      .insert(200)
      .insert(4);

    expect(testee.slice()).toEqual([0, 2, 3, 100, 200, 4]);
    expect(testee.pop()).toEqual(0);
    expect(testee.slice()).toEqual([2, 4, 3, 100, 200]);
  });

  it('throws when pop from an empty && strict heap', () => {
    const testee = new MinHeap(NumericOrder, 5, true);
    expect(testee.slice()).toEqual([]);
    expect(() => testee.pop()).toThrow(/nothing to pop/);
  });
});
