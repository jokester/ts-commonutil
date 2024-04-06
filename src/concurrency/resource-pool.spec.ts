import { ResourcePool } from './resource-pool';
import { Never, wait } from './timing';

describe(ResourcePool.name, () => {
  describe('single resource: mutex-like', () => {
    const testee = ResourcePool.single(1);

    it('can be used as mutex when initialized with 1 resource', async () => {
      const start = Date.now();
      const [f1, f2] = await Promise.all([testee.use(() => wait(1e3)), testee.use(() => wait(1e3))]);
      expect(Date.now() - start).toBeGreaterThan(1.99e3);
    });

    describe('tryUse()', () => {
      it('returns null when resource is occupied', async () => {
        const executing = testee.use(() => wait(1e3));
        const got1 = await testee.tryUse((got) => got);
        expect(got1).toBe(null);
        await executing;
        const got2 = await testee.tryUse((got) => got);
        expect(got2).toBe(1);
      });
    });
  });

  describe('multi resources: pool-like', () => {
    describe('wait', () => {
      it('returns true when no other tasks', async () => {
        const testee = ResourcePool.multiple([1, 2]);
        const isEmpty = await Promise.race([testee.wait({ queueLength: 0 }), wait(0.1e3, false)]);
        expect(isEmpty).toBeTruthy();
      });

      it('returns true when other task completes', async () => {
        const start = Date.now();
        const testee = ResourcePool.multiple([1, 2]);
        testee.use(() => wait(0.5e3));
        const becameEmpty = await testee.wait({ freeCount: 2 });
        expect(becameEmpty).toBeTruthy();
        expect(Date.now() - start).toBeGreaterThan(0.5e3);
      });

      it('returns false when other tasks running', async () => {
        const testee = ResourcePool.multiple([1, 2]);
        testee.use(() => Never);

        const noOtherTask = await testee.wait({ freeCount: 2 }, 1e3);
        expect(noOtherTask).toBeFalsy();
      });
    });
  });
});
