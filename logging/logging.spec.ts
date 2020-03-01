import { getDebugNamespace } from './get-debug-namespace';

describe('logging', () => {
  describe('getDebugNameSpace()', () => {
    it('calculates namespace from filename', () => {
      expect(getDebugNamespace('/a/b/c')('/a/b/c/d/e/f')).toEqual('d:e:f');
      expect(getDebugNamespace('/a/b/e')('/a/b/c/d/e/f')).toEqual('a:b:c:d:e:f');
    });
  });
});
