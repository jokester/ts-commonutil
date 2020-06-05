import { positions, powOf2 } from './btree';

describe('btree.ts', () => {
  it('calculates position', () => {
    expect(positions.parent(0)).toEqual(-1);
    expect(positions.parent(1)).toEqual(0);
    expect(positions.parent(2)).toEqual(0);
    expect(positions.parent(3)).toEqual(1);

    expect(positions.leftChild(1)).toEqual(3);
    expect(positions.rightChild(1)).toEqual(4);
  });

  it('calculates next pow of 2', () => {
    expect(powOf2.nextPowOf2(1)).toEqual(1);
    expect(powOf2.nextPowOf2(2)).toEqual(2);
    expect(powOf2.nextPowOf2(3)).toEqual(4);
    expect(powOf2.nextPowOf2(4)).toEqual(4);
  });
  it('calculates prev pow of 2', () => {
    expect(powOf2.prevPowOf2(1)).toEqual(1);
    expect(powOf2.prevPowOf2(2)).toEqual(2);
    expect(powOf2.prevPowOf2(3)).toEqual(2);
    expect(powOf2.prevPowOf2(4)).toEqual(4);
  });
});
