import { useMemo, useState } from 'react';

const inc = (_: number) => 1 + _;

export function useVersionedMemo<T>(compute: () => T, deps: any[]) {
  const [version, setVersion] = useState(0);

  const computed = useMemo(compute, [version, ...deps]);

  return [computed, () => setVersion(inc)] as const;
}
