export class TotalOrdered<T> {
  static invert<T>(orig: TotalOrdered<T>): TotalOrdered<T> {
    return new TotalOrdered<T>((a, b) => -orig.compare(a, b) as 1 | 0 | -1);
  }

  constructor(readonly compare: (a: T, b: T) => 1 | 0 | -1) {}

  before(a: T, b: T): boolean {
    return this.compare(a, b) < 0;
  }

  equal(a: T, b: T): boolean {
    return this.compare(a, b) === 0;
  }

  sort(elements: T[]): T[] {
    return elements.sort(this.compare);
  }
}

function builtinOrder<T extends string | number>(a: T, b: T): 1 | 0 | -1 {
  if (a < b) return -1;
  if (a === b) return 0;
  return 1;
}

export const NumericOrder = new TotalOrdered<number>(builtinOrder);

export const LexicographicalOrder = new TotalOrdered<string>(builtinOrder);
