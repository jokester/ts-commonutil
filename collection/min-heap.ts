import { TotalOrdered } from '../algebra/total-ordered';
import { positions } from './btree';

export class MinHeap<T> {
  private readonly tree: T[] = [];
  slice = this.tree.slice.bind(this.tree);

  constructor(private readonly order: TotalOrdered<T>, readonly capacity: number, private readonly strict = false) {}

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

  remove(): T | undefined {
    if (!this.size) {
      if (this.strict) throw new Error('MinHeap#remove(): nothing to remove');
      return undefined;
    } else if (this.size === 1) {
      return this.tree.pop();
    } else {
      const ret = this.tree[0];

      const v = (this.tree[0] = this.tree.pop()!);

      for (let i = 0; i < this.tree.length; ) {
        const l = positions.leftChild(i),
          r = positions.rightChild(i);

        /**
         *     [i] === v
         *     / \
         *   [l] [r]
         *
         */
        if (r < this.tree.length) {
          // when it has 2 children
          if (this.order.before(this.tree[l], this.tree[r]) && this.order.before(this.tree[l], v)) {
            // swap [i] and [l] and continue
            this.tree[i] = this.tree[l];
            this.tree[l] = v;
            i = l;
          } else if (this.order.before(this.tree[r], this.tree[l]) && this.order.before(this.tree[r], v)) {
            // swap [i] and [l] and continue
            this.tree[i] = this.tree[r];
            this.tree[r] = v;
            i = r;
          } else {
            break; // v is already before all children
          }
        } else if (l < this.tree.length && this.order.before(this.tree[l], v)) {
          this.tree[i] = this.tree[l];
          this.tree[l] = v;
          i = l;
          break; // there cannot be next level
        } else {
          break; // when we couldn't exchange this.tree[i] with any of its children
        }
      }

      return ret;
    }
  }

  insertMany(...values: T[]): this {
    return values.reduce((t, v) => t.insert(v), this);
  }

  removeMany(count: number): T[] {
    const ret: T[] = [];
    for (let i = 0; i < count && (this.strict /* to let remove() throw */ || this.tree.length); i++) {
      ret[i] = this.remove()!;
    }

    return ret;
  }

  peek(): T | undefined {
    if (!this.size && this.strict) throw new Error('MinHeap#peek(): nothing to peek');
    return this.tree[0];
  }
}
