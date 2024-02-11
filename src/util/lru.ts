/**
 * LRU cache for string-indexed, non-falsy values
 *
 * NOTE all methods are synchronized,
 * i.e. they do no use timeout/promise/async,await,
 *      and will not run before/after function calls.
 *
 * @class SingleThreadedLRU
 * @template T {type} type of cached values, must be non-falsy
 * @deprecated prefer npm/flru instead, as fox said
 */
export class SingleThreadedLRU<T> {
  private readonly values = new Map<string, T>();

  /**
   * Keys recently used in get() and put()
   *
   * Essentially the last elements in a unlimited ordered list of used keys.
   */
  private readonly recentKeys: string[] = [];
  /**
   * #occurance of key in recentKeys
   */
  private readonly recentKeyCount = new Map<string, number>();

  /**
   * @param capacity max size of this.values
   */
  constructor(readonly capacity: number) {
    if (capacity !== capacity >>> 0 || capacity < 1) {
      throw new Error('capacity must be a positive integer');
    } else if (capacity > 1 << 20) {
      throw new Error(`capacity too large: ${capacity}`);
    }
  }

  /**
   * Query if key exists in cache
   * (not mutating state in any way)
   *
   * @param {string} key
   * @returns {boolean} it exists
   */
  contain(key: string): boolean {
    return this.values.has(key);
  }

  /**
   *
   * @param {string} key
   *
   * @param value
   * @memberOf SingleThreadedLRU
   */
  put(key: string, value: T) {
    this.values.set(key, value);
    if (!this.refreshKey(key) && this.currentSize() > this.capacity) {
      this.removeLeastUsedValue();
    }
    if (this.recentKeys.length > this.capacity * 2) {
      this.squeezeRecentKeys();
    }
  }

  /**
   *
   * @param {string} key
   * @param refreshKey
   * @returns {T} value if it exists in cache, null otherwise
   *
   * @memberOf SingleThreadedLRU
   */
  get(key: string, refreshKey = true): T | null {
    if (this.values.has(key)) {
      const value = this.values.get(key)!;
      if (refreshKey) {
        this.refreshKey(key);
      }
      return value;
    }
    return null;
  }

  /**
   * Swap out least recent values
   *
   * @param {number} targetSize loop until falls under targetSize
   *
   * @memberOf SingleThreadedLRU
   */
  squeezeValues(targetSize: number) {
    const initialSize = this.currentSize();
    while (this.recentKeys.length && this.values.size > targetSize) {
      this.removeLeastUsedValue();
    }

    return this.currentSize() - initialSize;
  }

  /**
   * Current size of values
   *
   * @returns {number} recently used
   *
   * @memberOf SingleThreadedLRU
   */
  currentSize(): number {
    return this.values.size;
  }

  /**
   * Refresh a key when it get used
   * @return whether the k existed before refresh
   */
  private refreshKey(k: string): boolean {
    this.recentKeys.push(k);
    return incNum(this.recentKeyCount, k, 1) > 1;
  }

  private removeLeastUsedValue() {
    while (this.recentKeys.length) {
      const k = this.recentKeys.shift()!;
      if (getNum(this.recentKeyCount, k) === 1) {
        this.recentKeyCount.delete(k);
        this.values.delete(k);
        break;
      } else {
        incNum(this.recentKeyCount, k, -1);
      }
    }
  }

  /**
   * Remove first ones from recent keys if they have other occurrences
   */
  private squeezeRecentKeys() {
    while (this.recentKeys.length > this.capacity) {
      const k = this.recentKeys[0];
      const restOccurrence = getNum(this.recentKeyCount, k);
      if (restOccurrence > 1) {
        this.recentKeys.shift();
        incNum(this.recentKeyCount, k, -1);
      } else {
        break; // while
      }
    }
  }
}

function getNum(map: Map<string, number>, k: string) {
  return map.get(k) || 0;
}

function incNum(map: Map<string, number>, k: string, delta: number): number {
  const newValue = getNum(map, k) + delta;
  if (newValue) {
    map.set(k, newValue);
  } else {
    map.delete(k);
  }
  return newValue;
}

function assertInvariant<T>(values: Map<string, T>, recentKeyCount: Map<string, number>, recentKeys: string[]) {
  for (const k of values.keys()) {
    if (!recentKeyCount.has(k)) {
      throw new Error('assertion error');
    }
  }

  if (Array.from(recentKeyCount.keys()).length !== Array.from(values.keys()).length) {
    throw new Error('assertion error');
  }

  const actualCount = recentKeys.reduce((count, k) => {
    incNum(count, k, 1);
    return count;
  }, new Map<string, number>());

  if (Array.from(actualCount.keys()).length !== Array.from(actualCount.keys()).length) {
    throw new Error('assertion error');
  }

  for (const k of actualCount.keys()) {
    if (actualCount.get(k) !== recentKeyCount.get(k)) {
      throw new Error('assertion error');
    }
  }
}
