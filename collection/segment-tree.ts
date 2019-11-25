import { Monoid } from '../algebra/monoid';
import { positions, powOf2 } from './btree';

/**
 *
 */
export class SegmentTree<T> {
  /**
   * elements
   */
  private readonly elems: T[];
  /**
   * a complete binary tree for sums of elements
   *
   * ---
   *
   * for i <= (sums.length -1) / 2 - 1:
   * sum[i] === sum[2i+1] + sum[2i+2]
   *
   * -----
   * for i >= (sums.length -1) / 2:
   * let b = (sums.length -1) / 2   // bias of index
   * sum[b + i] = elems[2i+1] + elems[2i+2]
   *
   */
  private readonly sums: T[];

  constructor(private readonly monoid: Monoid<T>, init: T[]) {
    const lenSums = powOf2.nextPowOf2(init.length);

    this.elems = init.slice();
    const sums: T[] = (this.sums = []);

    for (let i = 0; i < lenSums; i++) {
      sums[i] = this.monoid.id;
    }

    // FIXME: set
  }

  get(index: number) {
    return this.elems[index];
  }

  set(index: number, value: T) {
    this.elems[index] = value;
  }

  /**
   *
   * @param start min index
   * @param end (exclusive) max index
   */
  sum(start: number, end: number) {}

  private *enumerateIndexInSum(indexInElems: number, lenSums: number): IterableIterator<number> {}
}
