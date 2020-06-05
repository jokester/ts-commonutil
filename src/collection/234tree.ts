import { TotalOrdered } from '../algebra/total-ordered';

class Tree<T> {
  private root: Node<T>;
  constructor(initial: T, private compare: TotalOrdered<T>) {
    this.root = { nVal: 1, c1: null, c2: null, v1: initial };
  }

  insert(v: T) {
    
  }

}

type Node<T> =
  | {
      nVal: 1;
      c1: null | Node<T>;
      v1: T;
      c2: null | Node<T>;
    }
  | {
      nVal: 2;
      c1: null | Node<T>;
      v1: T;
      c2: null | Node<T>;
      v2: T;
      c3: null | Node<T>;
    }
  | {
      nVal: 3;
      c1: null | Node<T>;
      v1: T;
      c2: null | Node<T>;
      v2: T;
      c3: null | Node<T>;
      v3: T;
      c4: null | Node<T>;
    };
