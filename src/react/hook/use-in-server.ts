import { useState, useLayoutEffect, useEffect } from 'react';

const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useInServer(): boolean {
  const [inServer, setInServer] = useState(true);
  useIsomorphicEffect(() => {
    setInServer(false);
  }, []);

  return inServer;
}
