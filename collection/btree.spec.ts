import { positions } from './btree';

describe('btree.ts', () => {
  it('calculates position', () => {
    expect(positions.parent(0)).toEqual(-1);
    expect(positions.parent(1)).toEqual(0);
    expect(positions.parent(2)).toEqual(0);
    expect(positions.parent(3)).toEqual(1);

    expect(positions.leftChild(1)).toEqual(3);
    expect(positions.rightChild(1)).toEqual(4);
  });
});
