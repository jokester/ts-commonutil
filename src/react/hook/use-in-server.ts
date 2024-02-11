import { useState, useLayoutEffect } from 'react';

export function useInServer(): boolean {
  const [inServer, setInServer] = useState(true);
  useLayoutEffect(() => {
    setInServer(false);
  }, []);

  return inServer;
}
