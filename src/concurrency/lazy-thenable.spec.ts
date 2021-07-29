import { lazyThenable } from './lazy-thenable';
import { wait } from './timing';

describe(lazyThenable, () => {
  it('do not run action until then-ed', async () => {
    let called = 0;
    const lazy1 = lazyThenable(async () => ++called);

    expect(called).toEqual(0);

    const converted = Promise.resolve(lazy1);
    expect(called).toEqual(0);
    await wait(0);
    expect(called).toEqual(1);
    expect(await converted).toEqual(1);
    expect(called).toEqual(1);
  });

  it('run actual action at most once', async () => {
    let called = 0;
    const lazy2 = lazyThenable(async () => ++called);

    expect(await lazy2).toEqual(1);
    for (let i = 0; i < 10; i++) {
      expect(await lazy2.then((value) => value)).toEqual(1);
    }
    expect(called).toEqual(1);
  });
});
