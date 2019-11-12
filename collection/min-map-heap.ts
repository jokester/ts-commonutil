import { TotalOrdered } from '../algebra/total-ordered';

export class MinHeap<T> {
  private readonly tree: T[] = [];
  constructor(private readonly order: TotalOrdered<T>, readonly capacity: number) {}

  getTop(): T | undefined {
    return this.tree[0];
  }

  takeTop(): T | undefined {
    return undefined;
  }

  insert(value: T) {}
}
