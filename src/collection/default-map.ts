export class DefaultMap<K, V> extends Map<K, V> {
  constructor(private readonly createDefault: (k: K) => V, entries?: readonly [K, V][]) {
    super(entries);
  }

  getOrCreate(k: K): V {
    if (!this.has(k)) {
      this.set(k, this.createDefault(k));
    }
    return this.get(k)!;
  }
}
