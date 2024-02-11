import { withRetry } from './with-retry';

describe('with-retry', () => {
  it('return resolved value before attempts exhausted', async () => {
    const io = jest
      //
      .fn()
      .mockRejectedValueOnce(1)
      .mockRejectedValueOnce(2)
      .mockResolvedValueOnce(3);
    await expect(withRetry(io)).resolves.toEqual(3);
  });

  it('throw last fail if attempts exhausted', async () => {
    const io = jest
      //
      .fn()
      .mockRejectedValueOnce(1)
      .mockRejectedValueOnce(2)
      .mockRejectedValueOnce(3);
    await expect(withRetry(io)).rejects.toEqual(3);
  });

  describe('when shouldBreak() specified', () => {
    it('can break after certain attempt', async () => {
      const io = jest
        //
        .fn()
        .mockRejectedValueOnce(1)
        .mockRejectedValueOnce(2)
        .mockRejectedValueOnce(3);

      await expect(withRetry(io, { shouldBreak: (e, i) => i >= 2 })).rejects.toEqual(2);
    });

    it('can break on certain error', async () => {
      const io = jest
        //
        .fn()
        .mockRejectedValueOnce(1)
        .mockRejectedValueOnce(2)
        .mockRejectedValueOnce(3);

      await expect(withRetry(io, { shouldBreak: async (e, i) => e === 1 })).rejects.toEqual(1);
    });
  });
});
