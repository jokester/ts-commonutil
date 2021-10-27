export const Proxies = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  revoked<T extends object>(): T {
    const { proxy, revoke } = Proxy.revocable<T>({} as any, {});
    revoke();
    return proxy;
  },
} as const;
