import { Deferred } from './deferred';
import fs from 'fs';

describe('Deferred', () => {
  it('resolves when fulfill() is called', async () => {
    const p = new Deferred<string>();
    expect(p.resolved).toBe(false);
    p.fulfill('hey');

    expect(p.resolved).toBe(true);
    expect(await p).toBe('hey');

    p.fulfill('ho');
    expect(await p).toBe('hey');

    p.reject(1);
    expect(await p).toBe('hey');
  });

  it('resolves when reject() called', async () => {
    const p = new Deferred<string>();
    expect(p.resolved).toBe(false);
    p.reject('ho');
    expect(p.resolved).toBe(true);

    let reason: unknown;
    try {
      await p;
    } catch (e) {
      reason = e;
    }

    expect(reason).toEqual('ho');
  });

  it('throws on fulfill()/reject() if strict is true', () => {
    const p = new Deferred<string>(true);

    p.fulfill('');
    expect(() => p.fulfill('3')).toThrow('already resolved');
    expect(() => p.reject('3')).toThrow('already resolved');
  });

  it('can be fulfilled with node-like callback', async () => {
    const p = new Deferred<string>();

    setTimeout(() => p.completeCallback(null, 'str'));
    expect(
      await p.then(
        (l) => l,
        (r) => r,
      ),
    ).toEqual('str');
  });

  it('can be rejected with node-like callback', async () => {
    const p = new Deferred<string>();

    setTimeout(() => p.completeCallback('err', 'str'));
    expect(
      await p.then(
        (l) => l,
        (r) => r,
      ),
    ).toEqual('err');
  });

  it('provides callback api', async () => {
    const f = await Deferred.fromCallback<Buffer>((callback) => fs.readFile(__filename, callback));
    expect(f).toBeInstanceOf(Buffer);
  });
});
