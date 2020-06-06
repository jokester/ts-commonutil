import { TotalOrdered } from '../algebra/total-ordered';

export class TFTree<T> {
  private root: Node<T>;
  constructor(initial: T, private readonly ordered: TotalOrdered<T>) {
    this.root = [null, initial, null];
  }

  insert(newValue: T) {
    const path: number[] = [];

    let p = this.root,
      pParent: MaybeNode<T> = null,
      pIndex = -1;

    while (p) {
      if (p.length === 7) {
        if (pParent && pIndex > 0) {
          // split at non-root
          const l = (p.slice(0, 3) as unknown) as Node<T>;
          const c = p[3] as T;
          const r = (p.slice(4) as unknown) as Node<T>;

          (pParent as MutableNode<T>).splice(pIndex, 1, l, c, r);
          p = pParent;
          // allow pIndex to be incorrect fow now
        } else if (!pParent) {
          // split at root
          const l = (p.slice(0, 3) as unknown) as Node<T>;
          const r = (p.slice(4) as unknown) as Node<T>;
          const newRoot = [l, p[3], r] as Node<T>;
          p = this.root = newRoot;
          // allow pParent/pIndex to be incorrect for now
        }
      } else {
        // find at non-full level
        const existedIndex = this.findInLevel(p, newValue);
        if (existedIndex % 2) {
          throw new Error(`Duplicated entry: ${existedIndex}`);
        }

        const nextLevel = p[existedIndex] as MaybeNode<T>;
        if (nextLevel) {
          pParent = p;
          p = nextLevel;
          pIndex = existedIndex;
          // continue
        } else {
          (p as MutableNode<T>)[existedIndex] = newValue;
          return;
        }
      }
    }
  }

  DEBUG$$findPath(wanted: T) {
    return this.findPath(wanted);
  }

  private findPath(wanted: T): readonly number[] {
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
  //
  | readonly [MaybeNode<T>, T, MaybeNode<T>, T, MaybeNode<T>];

type MutableNode<T> =
  | [MaybeNode<T>, T, MaybeNode<T>]
  //
  | [MaybeNode<T>, T, MaybeNode<T>, T, MaybeNode<T>];
