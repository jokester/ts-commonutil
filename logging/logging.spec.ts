import { getDebugNamespace } from './get-debug-namespace';

describe('logging', () => {
  describe('getDebugNameSpace()', () => {
    it('calculates namespace from filename', () => {
      expect(getDebugNamespace('/a/b/c', true)('/a/b/c/d/e/f')).toEqual('d:e:f');
      expect(getDebugNamespace('/a/b/c', true)('/a/b/c/d/e/f.js')).toEqual('d:e:f');
      expect(getDebugNamespace('/a/b/e')('/a/b/c/d/e/f')).toEqual('a:b:c:d:e:f');
      expect(getDebugNamespace('/a/b/e')('/a/b/c/d/e/f', 'g')).toEqual('a:b:c:d:e:f:g');
    });
  });
});
