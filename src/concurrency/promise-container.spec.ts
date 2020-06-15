import { PromiseContainer, PromiseState } from './promise-container';
import { wait } from './timing';
import { TicToc } from './tic-toc';

describe('promise-container', () => {
  it('keeps promised value', async () => {
    const testee = new PromiseContainer<number>(wait(1e3, 1));
    expect(testee.state).toEqual(PromiseState.pending);

    await testee;
    expect(testee.state).toEqual(PromiseState.fulfilled);
    expect(testee.isFulfilled() && testee.value).toEqual(1);
  });

  it('is doomed by default', async complete => {
    const testee = new PromiseContainer<number>();

    try {
      await testee;
      complete.fail('should not be here');
    } catch (e) {
      expect(e).toMatch(/doomed/i);
      complete();
    }
  });

  it('only exposes value/reason after type guards', () => {
    const testee = new PromiseContainer<number>(0);

    if (testee.isFulfilled()) {
      const shouldBeNum: number = testee.value;
      // @ts-expect-error
      const reason: string = testee.reason;
    }

    if (testee.isRejected()) {
      // reason is accessible, but unknown
      const reason = testee.reason as string;
      // @ts-expect-error
      const uncastedReason: string = testee.reason;
    }

    if (testee.isPending()) {
      // @ts-expect-error
      testee.reason;
      // @ts-expect-error
      testee.value;
    }
  });

  it('does not replace a pending promise by default', async complete => {
    const testee = new PromiseContainer<number>(1);

    const notReplaced = testee.replace(async prev => {
      complete.fail('should not be called');
      return NaN;
    });

    await testee.replace(async prev => 1 + (await prev), { onPending: true });

    expect(await notReplaced).toBe(1);
    expect(testee.isFulfilled() && testee.value).toBe(2);

    complete();
  });

  it('does not replace fulfilled promise by default', async complete => {
    const testee = new PromiseContainer<number>(1);
    await testee;
    expect(testee.isFulfilled() && testee.value).toBe(1);

    const notReplaced = await testee.replace(async prev => {
      complete.fail('should not be called');
      return NaN;
    });
    expect(testee.isFulfilled() && testee.value).toBe(1);

    await testee.replace(async prev => 1 + (await prev), { onFulfilled: true });
    expect(testee.isFulfilled() && testee.value).toBe(2);

    complete();
  });

  it('does replace rejected promise by default', async complete => {
    const testee = new PromiseContainer<number>(Promise.reject('rejected'));

    try {
      await testee;
      complete.fail('should throw');
    } catch {}

    const replaced = await testee.replace(() => 1);
    expect(replaced).toEqual(1);

    complete();
  });

  it('DOES cause deadlock when replace() referenced self', async () => {
    const testee = new PromiseContainer<number>(1);

    const tic = new TicToc();

    await Promise.race([
      testee.replace(async prev => 1 + (await testee) + (await prev), {
        onPending: true,
      }),
      wait(1e3),
    ]);
    expect(tic.toc()).toBeGreaterThan(1e3);
  });
});
