import { positions } from './btree';
import { Ord } from 'fp-ts/Ord';

function isBefore<T>(ord: Ord<T>, a: T, b: T): boolean {
  return ord.compare(a, b) < 0;
}

export class MinHeap<T> {
  private readonly tree: T[] = [];
  slice = this.tree.slice.bind(this.tree);

  constructor(
    private readonly order: Ord<T>,
    private readonly strict = false,
    initialTree?: T[],
  ) {
    if (initialTree) this.tree.push(...initialTree);
    if (strict) this.assertInvariants();
  }

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

    while (i && isBefore(this.order, value /* i.e. this.tree[i] */, this.tree[j])) {
      // pop up new value
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
          if (isBefore(this.order, this.tree[l], this.tree[r]) && isBefore(this.order, this.tree[l], v)) {
            // swap [i] and [l] and continue
            this.tree[i] = this.tree[l];
            this.tree[l] = v;
            i = l;
          } else if (isBefore(this.order, this.tree[r], this.tree[l]) && isBefore(this.order, this.tree[r], v)) {
            // swap [i] and [l] and continue
            this.tree[i] = this.tree[r];
            this.tree[r] = v;
            i = r;
          } else {
            break; // v is already before all children
          }
        } else if (l < this.tree.length && isBefore(this.order, this.tree[l], v)) {
          this.tree[i] = this.tree[l];
          this.tree[l] = v;
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

  clone() {
    return new MinHeap(this.order, this.strict, this.tree);
  }

  shrink(size: number): this {
    const tmpHeap = new MinHeap(this.order, true, this.removeMany(size));
    this.tree.splice(0, this.tree.length, ...tmpHeap.slice());
    return this;
  }

  shrinkUntil(v: T, inclusive = false): this {
    const afterShrink: T[] = [];
    while (
      this.tree.length &&
      (isBefore(this.order, this.tree[0], v) || (inclusive && !this.order.compare(this.tree[0], v)))
    ) {
      afterShrink.push(this.remove()!);
    }
    this.tree.splice(0, this.tree.length, ...afterShrink);
    return this;
  }

  private assertInvariants() {
    for (let i = 1; i < this.tree.length; i++) {
      const p = positions.parent(i);
      if (!isBefore(this.order, this.tree[p], this.tree[i])) {
        throw new Error(`MinHeap#assertInvariants(): expected this.tree[${p} to be ordered before this.tree[${i}]`);
      }
    }
  }
}
