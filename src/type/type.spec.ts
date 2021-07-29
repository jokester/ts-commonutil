import { liftA2 } from './index';

describe('liftA2', () => {
  it('lifts a sync function to promise', async () => {
    const liftedPlus = liftA2((a: number, b: number) => a + b);
    const sum = await liftedPlus(3, Promise.resolve(5));
    expect(sum).toEqual(8);
  });
});
