/**
 * LRU cache
 */

/**
 * "upstream" of cache: sync or async
 */
interface DataSource<Key, Value> {
    (k: Key): Promise<Value>;
}

export class LRU<Key, Value> {
}
