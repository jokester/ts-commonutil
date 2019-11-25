export const positions = {
  /**
   * @param index
   * @note parent(0) === -1
   */
  parent: (index: number) => (index - 1) >> 1,
  leftChild: (index: number) => 2 * index + 1,
  rightChild: (index: number) => 2 * index + 2,
} as const;

export const powOf2 = {
  isPowOf2: (x: number) => !!(x & (x - 1)),

  nextPowOf2: (x: number) => {
    if (!(x & (x - 1))) return x;
    return 1 << Math.ceil(Math.log2(x) /* must be a non-integer */);
  },

  prevPowOf2: (x: number) => {
    if (!(x & (x - 1))) return x;
    return 1 << Math.floor(Math.log2(x) /* must be a non-integer */);
  },
} as const;
