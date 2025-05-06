import { sample, sampleSize } from './sample';

function fakeRng() {
  return 0.3;
}

describe('sample', () => {
  it('picks random value', () => {
    expect(sample([1, 2, 3], fakeRng)).toMatchSnapshot('sample([1,2,3])');
  });
  it('returns undefined on empty array', () => {
    expect(sample([])).toBeUndefined();
  });
});

describe('sampleSize', () => {
  it('return all elements when count==input.len', () => {
    expect(sampleSize([1, 2, 3], 3, fakeRng)).toEqual([1, 2, 3]);
  });
  it('return {count} elements when input is sufficient', () => {
    expect(sampleSize([1, 2, 3], 2, fakeRng)).toEqual([1, 3]);
  });
  it('return {input.length} elements when input is insufficient', () => {
    expect(sampleSize([2, 3], 3, fakeRng)).toEqual([2, 3]);
  });
});
