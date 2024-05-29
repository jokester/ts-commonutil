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
  it('picks specified size', () => {
    expect(sampleSize([1, 2, 3], 2, fakeRng)).toMatchSnapshot('sampleSize([1,2,3], 2)');
  });
  it('returns undefined on empty array', () => {
    expect(sampleSize([2, 3], 3, fakeRng)).toHaveLength(2);
  });
});
