import { TotalOrdered } from '../algebra/total-ordered';
import { positions } from './btree';

export class MinHeap<T> {
  private readonly tree: T[] = [];
  constructor(private readonly order: TotalOrdered<T>, readonly capacity: number) {}

  get size() {
    return this.tree.length;
  }

  /**
   *
   * @param value
   */
  insert(value: T): this {
    let i = this.tree.length,
      j = positions.parent(i);
    this.tree[i] = value;

    while (i && this.order.before(value /* i.e. this.tree[i] */, this.tree[j])) {
      this.tree[i] = this.tree[j];
      this.tree[j] = value;

      i = j;
      j = positions.parent(i);
    }

    return this;
  }

  slice = this.tree.slice.bind(this.tree);
}
