import { asyncDebounce, asyncThrottle } from './async-throttle';
import { wait } from './timing';

describe(asyncThrottle.name, () => {
  it('throttles async function', async () => {
    const callee = jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    const throttled = asyncThrottle(callee as () => number, 200);
    expect(await throttled()).toEqual(1);
    expect(await throttled()).toEqual(1);
    expect(callee).toBeCalledTimes(1);

    await wait(200);
    expect(await throttled()).toEqual(2);
    expect(callee).toBeCalledTimes(2);
  });
});

describe(asyncDebounce.name, () => {
  it('debounces function', async () => {
    const callee = jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);

    const debounced = asyncDebounce(callee as () => number, 100);

    const d1 = debounced();
    const d2 = debounced();
    expect(d1).toBe(d2);
    expect(callee).toBeCalledTimes(0);

    await wait(100);
    expect(callee).toBeCalledTimes(1);

    const d3 = debounced();
    expect(callee).toBeCalledTimes(1);

    expect(await d1).toEqual(1);
    expect(await d3).toEqual(2);
    expect(callee).toBeCalledTimes(2);
  });
});
