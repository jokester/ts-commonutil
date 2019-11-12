export const positions = {
  parent: (index: number) => (index - 1) >> 1,
  leftChild: (index: number) => 2 * index + 1,
  rightChild: (index: number) => 2 * index + 2,
} as const;
