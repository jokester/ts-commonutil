import { TTFTree } from './234tree';
import { NumericOrder } from '../algebra/total-ordered';

describe('2-3-4 tree', () => {
  it('', () => {
    const tree = new TTFTree(5, NumericOrder);

    expect(tree.DEBUG$$findPath(5)).toEqual([1]);
    expect(tree.DEBUG$$findPath(4)).toEqual([0]);
    expect(tree.DEBUG$$findPath(6)).toEqual([2]);

    expect(() => tree.insert(5)).toThrowError(/dup/i);

    tree.insert(4);
  });
});
