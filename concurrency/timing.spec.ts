import { TicToc } from './tic-toc';
import { wait, withMinimumDuration } from './timing';

describe('timing.ts', () => {
  describe('withMinimumDuration', () => {
    it('ensures a minimum duration of task', async () => {
      const tictoc = new TicToc();

      const result = await withMinimumDuration(1e3, async () => 1);

      expect(result).toEqual(1);
      expect(tictoc.toc()).toBeGreaterThan(1e3);
    });
  });

  describe('wait', () => {
    it.skip('infers correct generic type', () => {
      const a: Promise<number> = wait(0, 1);

      const b: Promise<void> = wait(0);
    });
  });
});
