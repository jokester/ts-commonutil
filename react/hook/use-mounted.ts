import { useEffect, useRef } from 'react';

export function useMounted(): { readonly current: boolean } {
  const mountStateRef = useRef(false);
  useEffect(() => {
    mountStateRef.current = true;
    return () => {
      mountStateRef.current = false;
    };
  }, []);

  return mountStateRef;
}
