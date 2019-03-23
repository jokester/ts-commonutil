import { liftPromise, liftA2 } from './index';

describe('promisify', () => {
  it('runs', async () => {
    function foo0() {}

    function foo1(a: number) {
      return a + 1;
    }

    const result0 = await liftPromise(foo0);
    const result1 = await liftPromise(foo1)(2);

    expect(result1).toEqual(3);

    function foo5(a1: string, a2: string, a3: string, a4: number, a5: boolean) {
      return [a1, a2, a3].join(`${a4}${a5}`);
    }

    const result5 = await liftPromise(foo5)(Promise.resolve('a'), 'b', 'c', 5, false);
    expect(result5).toEqual('a5falseb5falsec');
  });
});

describe('liftA2', () => {
  it('lifts a sync function to promise', async () => {
    const liftedPlus = liftA2((a: number, b: number) => a + b);
    const sum = await liftedPlus(3, Promise.resolve(5));
    expect(sum).toEqual(8);
  });
});
