export abstract class TotalOrdered<T> {
  abstract before(a: T, b: T): boolean;

  abstract equal(a: T, b: T): boolean;

  sort(elements: T[]): T[] {
    return elements.sort((a, b) => {
      if (this.equal(a, b)) return 0;

      const before = this.before(a, b);
      return before ? -1 : 1;
    });
  }
}

export const NumericOrder = new (class extends TotalOrdered<number> {
  before(a: number, b: number): boolean {
    return a < b;
  }
  equal(a: number, b: number): boolean {
    return a === b;
  }
})();

export const LexicographicalOrder = new (class extends TotalOrdered<string> {
  before(a: string, b: string): boolean {
    return a < b;
  }

  equal(a: string, b: string): boolean {
    return a === b;
  }
})();
