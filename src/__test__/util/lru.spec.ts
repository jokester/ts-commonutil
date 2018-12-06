import { SingleThreadedLRU } from "../../util/lru";

const k1 = "k1";
const k2 = "k2";
const k3 = "k3";

describe("SingleThreadedLRU", () => {
  function createLRU(capacity: number) {
    return new SingleThreadedLRU<string>(capacity);
  }

  function toInspectable<T>(s: SingleThreadedLRU<T>) {
    return s as any as {
      values: Map<string, T>;
      recentKeys: string[];
      recentKeyCount: Map<string, number>;
    };
  }

  function countKeys(keys: string[]) {
    const v = new Map<string, number>();
    for (const k of keys) {
      v.set(k, 1 + (v.get(k) || 0));
    }
    return v;
  }

  it("creates", () => {
    const lru = createLRU(10333);
    expect(lru.capacity).toBe(10333);

    expect(createLRU(1048576)).toBeInstanceOf(SingleThreadedLRU);
    expect(() => createLRU(1048577)).toThrow();
    expect(() => createLRU(0)).toThrow();
    expect(() => createLRU(3.5)).toThrow();
  });

  it("updates 1", () => {
    const lru = createLRU(1);

    // lru with exposed private properties
    const lru$ = toInspectable(lru);
    expect(lru$.recentKeys).toEqual([]);
    expect(lru$.recentKeyCount).toEqual(new Map);

    // initial status
    expect(lru$.recentKeys).toEqual([]);
    expect(lru$.recentKeyCount).toEqual(new Map);

    // #1: get() or contain() on a non-existent key: should not cause squeeze
    expect(lru.contain("k1")).toEqual(false);
    expect(lru$.recentKeys).toEqual([]);
    expect(lru$.recentKeyCount).toEqual(new Map());
    expect(lru.get(k2)).toEqual(null);
    expect(lru$.recentKeys).toEqual([]);
    expect(lru$.recentKeyCount).toEqual(new Map);

    // #2: put new key
    lru.put(k1, "put#2");
    expect(lru$.values).toEqual(new Map([[k1, "put#2"]]));
    expect(lru$.recentKeys).toEqual([k1]);
    expect(lru$.recentKeyCount).toEqual(new Map([[k1, 1]]));

    // #3: put existing key, not causing squeeze
    lru.put(k1, "put#3");
    expect(lru$.values).toEqual(new Map([[k1, "put#3"]]));
    expect(lru$.recentKeys).toEqual([k1, k1]);
    expect(lru$.recentKeyCount).toEqual(countKeys(lru$.recentKeys));

    // #4: put new key & swap out least recent key
    lru.put(k2, "put#4");
    expect(lru$.values).toEqual(new Map([[k2, "put#4"]]));
    expect(lru$.recentKeys).toEqual([k2]);
    expect(lru$.recentKeyCount).toEqual(countKeys(lru$.recentKeys));

    // #5: put existing key, not causing swap out
    lru.put(k2, "put#5");
    expect(lru$.values).toEqual(new Map([[k2, "put#5"]]));
    expect(lru$.recentKeys).toEqual([k2, k2]);
    expect(lru$.recentKeyCount).toEqual(countKeys(lru$.recentKeys));

    // #6: put existing key & remove necessary key
    lru.put(k2, "put#6");
    expect(lru$.values).toEqual(new Map([[k2, "put#6"]]));
    expect(lru$.recentKeys).toEqual([k2]);
    expect(lru$.recentKeyCount).toEqual(countKeys(lru$.recentKeys));
  });

  it("updates 2", () => {
    const lru = createLRU(2);

    // lru with non-private properties
    const lru$ = toInspectable(lru);
    expect(lru$.recentKeys).toEqual([]);
    expect(lru$.recentKeyCount).toEqual({});

    lru.put(k1, k1);
    for (let v = 0; v < 5; v++) {
      lru.put(k2, k2);
    }
    expect(lru$.recentKeys).toEqual([k1, k2, k2, k2, k2, k2]);
    expect(lru$.recentKeyCount).toEqual(countKeys(lru$.recentKeys));
  });

  it("swap 1", () => {

    const lru = createLRU(2);
    for (const k of [k1, k2, k3, k3, k3, k2, k2, k3, k3, k1]) {
      lru.put(k, k);
    }
    expect(lru.currentSize()).toEqual(2);
    expect(lru.contain(k2)).toEqual(false);
    expect(lru.contain(k1)).toEqual(true);
    expect(lru.contain(k3)).toEqual(true);

    // swapout until last (k1)
    lru.swapOut(1);
    expect(lru.currentSize()).toEqual(1);
    expect(lru.contain(k1)).toEqual(true);
    expect(lru.contain(k3)).toEqual(false);
  });

  it("swap 2", () => {
    const lru = createLRU(2);
    for (const k of [k1, k2, k3, k3, k3, k2, k2, k3, k3, k1]) {
      lru.put(k, k);
    }
    expect(lru.currentSize()).toEqual(2);
    expect(lru.contain(k2)).toEqual(false);
    expect(lru.contain(k1)).toEqual(true);
    expect(lru.contain(k3)).toEqual(true);
    expect(lru.get(k3)).toEqual(k3);
    expect(lru.currentSize()).toEqual(2);

    // swapout until last (k3)
    lru.swapOut(1);
    expect(lru.currentSize()).toEqual(1);
    expect(lru.contain(k1)).toEqual(false);
    expect(lru.contain(k3)).toEqual(true);
  });
});
