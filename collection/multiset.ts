import { DefaultMap } from './default-map';

export class Multiset<T> {
  private map = new DefaultMap</* count */ number, /* objects */ Set<T>>(k => new Set());
  private countMap = new DefaultMap</* object*/ T, /* count */ number>(() => 0);

  setCount(obj: T, count: number) {
    const existedCount = this.countMap.get(obj);

    if (existedCount && existedCount !== count) {
      const existedSet = this.map.get(existedCount)!;
      existedSet.delete(obj);
      if (!existedSet.size) {
        this.map.delete(existedCount);
      }
      // not updating countMap: it will be overwritten / removed anyway
    }

    if (count) {
      this.map.getOrCreate(count).add(obj);
      this.countMap.set(obj, count);
    } else {
      this.countMap.delete(obj);
    }
  }

  getCount(obj: T): number {
    return this.countMap.get(obj) ?? 0;
  }

  maxCount() {
    return Math.max(0, ...Array.from(this.map.keys()));
  }

  getElemsOfCount(count: number): readonly T[] {
    return Array.from(this.map.get(count) || []);
  }
}