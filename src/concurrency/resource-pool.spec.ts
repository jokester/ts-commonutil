import { ResourcePool } from './resource-pool';
import { wait } from './timing';

describe(ResourcePool.name, () => {
  describe('single resource: mutex-like', () => {
    const testee = ResourcePool.single(2);
    it('can be used as mutex when initialized with 1 resource', async () => {
      const start = Date.now();
      const [f1, f2] = await Promise.all([testee.use(() => wait(1e3)), testee.use(() => wait(1e3))]);
      expect(Date.now() - start).toBeGreaterThan(1.99e3);
    });
  });
});
