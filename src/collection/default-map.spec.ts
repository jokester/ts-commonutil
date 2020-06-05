import { DefaultMap } from './default-map';

describe('DefaultMap', () => {
  it('create when absent', () => {
    const map = new DefaultMap<number, number>(k => k + 1);

    expect(map.size).toEqual(0);
    expect(map.get(0)).toEqual(undefined);
    expect(map.getOrCreate(0)).toEqual(1);
    expect(map.get(0)).toEqual(1);
    expect(map.size).toEqual(1);
  });
});
