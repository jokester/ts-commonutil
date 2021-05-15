import { ResourcePool } from './resource-pool';
import { Never, wait } from './timing';

describe(ResourcePool.name, () => {
  describe('single resource: mutex-like', () => {
    const testee = ResourcePool.single(null);

    it('can be used as mutex when initialized with 1 resource', async () => {
      const start = Date.now();
      const [f1, f2] = await Promise.all([testee.use(() => wait(1e3)), testee.use(() => wait(1e3))]);
      expect(Date.now() - start).toBeGreaterThan(1.99e3);
    });
  });

  describe('multi resources: pool-like', () => {
    describe('waitComplete', () => {
      it('returns true when no other tasks', async () => {
        const testee = ResourcePool.multiple([1, 2]);
        const isEmpty = await Promise.race([testee.waitComplete(), wait(0.1e3, false)]);
        expect(isEmpty).toBeTruthy();
      });

      it('returns true when other task completes', async () => {
        const start = Date.now();
        const testee = ResourcePool.multiple([1, 2]);
        testee.use(() => wait(0.5e3));
        const becameEmpty = await testee.waitComplete();
        expect(becameEmpty).toBeTruthy();
        expect(Date.now() - start).toBeGreaterThan(0.5e3);
      });

      it('returns false when other tasks running', async () => {
        const testee = ResourcePool.multiple([1, 2]);
        testee.use(() => Never);

        const noOtherTask = await testee.waitComplete(1e3);
        expect(noOtherTask).toBeFalsy();
      });
    });
  });
});
