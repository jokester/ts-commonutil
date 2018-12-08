/**
 * LRU cache for string-indexed, non-falsy values
 *
 * NOTE all methods are synchronized,
 * i.e. they do no use timeout/promise/async,await,
 *      and will not run before/after function calls.
 *
 * @export
 * @class SingleThreadedLRU
 * @template T {type} type of cached values, must be non-falsy
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

  constructor(readonly capacity: number) {
    if (capacity !== (capacity >>> 0)) {
      throw new Error(`capacity must be a positive integer`);
    } else if (capacity > (1 << 20) || capacity < 1) {
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
   * @param refreshKey
   * @memberOf SingleThreadedLRU
   */
  put(key: string, value: T) {
    this.values.set(key, value);
    this.updateRecentKeys(key);
    this.swapOut();
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
        this.updateRecentKeys(key);
      }
      // no need to squeeze(): get() only change order of recent-used keys
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
  swapOut() {
    while (this.values.size > this.capacity) {
      const k = this.recentKeys.shift()!;

      const restOccurrence = (this.recentKeyCount.get(k) || 0) - 1;

      if (!k || (restOccurrence < 0)) {
        throw new Error(`squeeze: illegal state : k=${k} / keys=${JSON.stringify(this.recentKeyCount)}`);
      } else if (restOccurrence === 0) {
        /**
         * k is the last occurrence of same key in this.recentKeys,
         * so it's safe to remove it from values
         */
        this.values.delete(k);
        this.recentKeyCount.delete(k);
      }
    }
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
   */
  private updateRecentKeys(key: string) {
    this.recentKeys.push(key);
    this.recentKeyCount.set(key, 1 + (this.recentKeyCount.get(key) || 0));

    // reduce keys when available, to prevent a long squeezeCache()
    if (this.recentKeys.length > this.capacity * 2) {
      this.squeezeRecentKeys();
    }
  }

  /**
   * Remove first ones from recent keys if they have other occurrences
   */
  private squeezeRecentKeys() {
    while (this.recentKeys.length > this.capacity) {
      const k = this.recentKeys[0];
      const restOccurrence = this.recentKeyCount.get(k);
      if (k && restOccurrence) {
        this.recentKeys.shift();
        this.recentKeyCount.set(k, (this.recentKeyCount.get(k) || 0) - 1);
      } else {
        break; // while
      }
    }
  }
}
