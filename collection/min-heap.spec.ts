import { MinHeap } from './min-heap';
import { NumericOrder } from '../algebra/total-ordered';

describe('MinHeap', () => {
  it('insert elements', () => {
    const testee = new MinHeap(NumericOrder);
    expect(testee.slice()).toEqual([]);

    expect(testee.insert(5).slice()).toEqual([5]);
    expect(testee.insert(2).slice()).toEqual([2, 5]);
    expect(testee.insert(1).slice()).toEqual([1, 5, 2]);
    expect(testee.insert(6).slice()).toEqual([1, 5, 2, 6]);
    expect(testee.insert(0).slice()).toEqual([0, 1, 2, 6, 5]);
  });

  it('removes element', () => {
    const testee = new MinHeap(NumericOrder).insertMany(5, 2, 1, 6, 0);

    expect(testee.remove()).toEqual(0);
    expect(testee.slice()).toEqual([1, 5, 2, 6]);
    expect(testee.remove()).toEqual(1);
    expect(testee.slice()).toEqual([2, 5, 6]);
    expect(testee.remove()).toEqual(2);
    expect(testee.remove()).toEqual(5);
    expect(testee.remove()).toEqual(6);
    expect(testee.remove()).toEqual(undefined);
    expect(testee.slice()).toEqual([]);
  });

  it('removes element - 2', () => {
    const testee = new MinHeap(NumericOrder)
      .insert(0)
      .insert(2)
      .insert(3)
      .insert(100)
      .insert(200)
      .insert(4);

    expect(testee.slice()).toEqual([0, 2, 3, 100, 200, 4]);
    expect(testee.remove()).toEqual(0);
    expect(testee.slice()).toEqual([2, 4, 3, 100, 200]);
  });

  it('throws when remove from or peek an empty && strict heap', () => {
    const testee = new MinHeap(NumericOrder, true);
    expect(testee.slice()).toEqual([]);

    expect(() => testee.remove()).toThrow(/nothing to remove/);
    expect(() => testee.peek()).toThrow(/nothing to peek/);
    expect(() => testee.insert(1).removeMany(2)).toThrow(/nothing to remove/);
  });
});
