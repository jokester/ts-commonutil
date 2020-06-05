export const Proxies = {
  revoked<T extends {}>(): T {
    const { proxy, revoke } = Proxy.revocable<T>({} as any, {});
    revoke();
    return proxy;
  },
} as const;
