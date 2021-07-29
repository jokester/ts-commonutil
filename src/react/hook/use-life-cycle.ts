import { useEffect, useMemo } from 'react';

interface PublicLifecycleDelegate {
  readonly mounted: boolean;
  readonly unmounted: Promise<void>;

  /**
   * equivalent to a {@code useEffect(callback, []) }
   * @requires !this.mounted
   * @param callback
   */
  onDidMount(callback: () => void): void;

  /**
   * equivalent to a {@code useEffect(() => () => callback(), []) }, but lifted to component scope
   * @param callback
   */
  onWillUnmount(callback: () => void): void;
}

class LifecycleDelegate implements PublicLifecycleDelegate {
  get mounted(): boolean {
    return this._mounted;
  }
  private _mounted = false;
  private _unmounted = false;
  private unmountCallback: (() => void)[] = [];
  private mountCallback: (() => void)[] = [];
  readonly unmounted = new Promise<void>((f) => this.unmountCallback.push(f));

  constructor(private readonly displayName?: string) {}

  onDidMount(callback: () => void): void {
    if (this._mounted) throw new Error('LifecycleDelegate: already mounted');

    this.mountCallback.push(callback);
  }

  onWillUnmount(callback: () => void): void {
    if (this._unmounted) throw new Error('LifecycleDelegate: already unmounted');

    this.unmountCallback.push(callback);
  }

  /* @private[file] */
  componentDidMount(): void {
    if (this.displayName) console.debug('componentDidMount', this.displayName);
    if (this._mounted) throw new Error('LifecycleDelegate: already mounted');

    this._mounted = true;
    for (let f; (f = this.mountCallback.shift()); f()) {}
  }

  /* @private[file] */
  componentWillUnmount(): void {
    if (this.displayName) console.debug('componentWillUnmount', this.displayName);
    if (this._unmounted) throw new Error('LifecycleDelegate: already unmounted');

    for (let f; (f = this.unmountCallback.shift()); f()) {}
    this._mounted = false;
    this._unmounted = true;
  }
}

/**
 * @deprecated prefer useLifeCycles / useUnmount etc (react-use)
 * @param displayName a name to log to console.debug with
 */
export function useLifeCycle(displayName?: string) {
  const s = useMemo<LifecycleDelegate>(() => new LifecycleDelegate(displayName), []);

  useEffect(() => {
    s.componentDidMount();
    return () => s.componentWillUnmount();
  }, []);

  return s as PublicLifecycleDelegate;
}
