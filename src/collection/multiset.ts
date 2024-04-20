import { DefaultMap } from './default-map';

export class Multiset<T> {
  private map = new DefaultMap</* count */ number, /* objects */ Set<T>>((k) => new Set());
  private countMap = new Map</* object*/ T, /* count */ number>();

  constructor(readonly removeOnZeroFreq = true) {}

  setCount(obj: T, count: number): void {
    const existedCount = this.countMap.get(obj);

    if (existedCount === count) {
      // noop
    } else if (existedCount !== undefined) {
      // modify
      this.countMap.set(obj, count);
      this.map.getOrCreate(count).add(obj);

      const existedSet = this.map.get(existedCount)!;
      existedSet.delete(obj);
      if (!existedSet.size && this.removeOnZeroFreq) {
        this.map.delete(existedCount);
      }
    } else {
      // just add
      this.countMap.set(obj, count);
      this.map.getOrCreate(count).add(obj);
    }
  }

  getCount(obj: T): number {
    return this.countMap.get(obj) ?? 0;
  }

  /**
   * delete an object and deference it
   * @param obj
   * @returns count (0 when it wasn't referenced in this set)
   */
  delete(obj: T): number {
    const count = this.countMap.get(obj);
    if (count !== undefined) {
      this.countMap.delete(obj);
      const s = this.map.get(count)!;
      s.delete(obj);
      if (!s.size) this.map.delete(count);
    }
    return 0;
  }

  touch(obj: T): void {
    const existedCount = this.countMap.get(obj);

    if (existedCount === undefined) {
      this.map.getOrCreate(0).add(obj);
      this.countMap.set(obj, 0);
    }
  }

  /**
   * dereference objects with freq=0
   */
  shrink(): void {
    const nils = this.map.get(0);
    if (nils) {
      for (const obj of nils) {
        this.countMap.delete(obj);
      }
      this.map.delete(0);
    }
  }

  maxCount(): number {
    return Math.max(0, ...Array.from(this.map.keys()));
  }

  findByCount(count: number): T[] {
    return Array.from(this.map.get(count) || []);
  }
}
