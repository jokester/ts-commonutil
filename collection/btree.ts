export const positions = {
  /**
   * @param index
   * @note parent(0) === -1
   */
  parent: (index: number) => (index - 1) >> 1,
  leftChild: (index: number) => 2 * index + 1,
  rightChild: (index: number) => 2 * index + 2,
} as const;
