import { TotalOrdered } from '../algebra/total-ordered';

export class TTFTree<T> {
  private root: Node<T>;
  constructor(initial: T, private readonly ordered: TotalOrdered<T>) {
    this.root = [null, initial, null];
  }

  insert(newValue: T) {
    const path: number[] = [];

    let p = this.root,
      pParent: MaybeNode<T> = null;

    while (p) {
      if (p.length === 7) {
        // split at p
        if (pParent) {
          const posInParent = findI

        }
      }

      const existedIndex = this.findInLevel(p, newValue);
      if (existedIndex % 2) {
        throw new Error(`Duplicated entry: ${existedIndex}`);
      }
      const nextLevel = p[existedIndex] as MaybeNode<T>;
      if (nextLevel) {
        p = nextLevel;
      }
    }
  }

  findPath(wanted: T): readonly number[] {
    const path: number[] = [];

    let level: MaybeNode<T> = this.root;

    while (level) {
      const matchedIndex = this.findInLevel(level, wanted);
      path.push(matchedIndex);

      if (matchedIndex % 2) {
        break;
      } else {
        level = level[matchedIndex] as MaybeNode<T>;
      }
    }

    return path;
  }

  /**
   * @returns {number} key index (odd) or hole index (even)
   */
  private findInLevel(level: Node<T>, wanted: T) {
    for (let keyIndex = 1; keyIndex < level.length - 1; keyIndex += 2) {
      const key = level[keyIndex] as T;
      if (this.eq(wanted, key)) {
        return keyIndex;
      } else if (this.lt(wanted, key)) {
        return keyIndex - 1;
      }
    }

    return level.length - 1;
  }

  private lt(t1: T, t2: T) {
    return this.ordered.before(t1, t2);
  }

  private eq(t1: T, t2: T) {
    return this.ordered.equal(t1, t2);
  }
}

type MaybeNode<T> = null /* only in root */ | Node<T>;

type Node<T> =
  | readonly [MaybeNode<T>, T, MaybeNode<T>]
  | readonly [MaybeNode<T>, T, MaybeNode<T>, T, MaybeNode<T>]
  | readonly [MaybeNode<T>, T, MaybeNode<T>, T, MaybeNode<T>, T, MaybeNode<T>];
