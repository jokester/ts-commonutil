import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Proxies } from '../../util/proxys';
import { BehaviorSubject } from 'rxjs';

/**
 * A wrapped router with
 * - mutual-exclusive navigation action
 * - observable navigation state
 */
class WrappedNextRouter {
  private readonly routeChangingSubject = new BehaviorSubject<boolean>(false);
  readonly routeChanging = this.routeChangingSubject.asObservable();
  private routeChangeCompleteCallback: ((url: string) => void)[] = [];
  private routeChangeErrorCallback: ((error: unknown) => void)[] = [];

  constructor(private readonly router: typeof Router) {
    this.routeChangingSubject.next(false);
  }

  componentDidMount() {
    this.router.events.on('routeChangeStart', this.routeChangeStart);
    this.router.events.on('routeChangeComplete', this.routeChangeComplete);
    this.router.events.on('routeChangeError', this.routeChangeError);
  }

  componentWillUnmount() {
    this.router.events.off('routeChangeStart', this.routeChangeStart);
    this.router.events.off('routeChangeComplete', this.routeChangeComplete);
    this.router.events.off('routeChangeError', this.routeChangeError);
  }

  startRouteChange(changer: (r: typeof Router) => void): Promise<string> {
    if (this.routeChangingSubject.value) {
      throw new Error('route already changing');
    }
    return new Promise<string>((fulfill, reject) => {
      this.routeChangeCompleteCallback.push(fulfill);
      this.routeChangeErrorCallback.push(reject);
      changer(this.router);
    });
  }

  private routeChangeStart = (url: string) => {
    if (!this.routeChangingSubject.value) this.routeChangingSubject.next(true);
  };

  private routeChangeComplete = (url: string) => {
    if (this.routeChangingSubject.value) this.routeChangingSubject.next(false);
    while (this.routeChangeCompleteCallback.length) {
      this.routeChangeCompleteCallback.shift()!(url);
    }
  };

  private routeChangeError = (err: unknown, url: string) => {
    if (this.routeChangingSubject.value) this.routeChangingSubject.next(false);
    while (this.routeChangeErrorCallback.length) {
      this.routeChangeErrorCallback.shift()!(url);
    }
  };
}

const WrappedNextRouterContext = React.createContext<WrappedNextRouter>(Proxies.revoked());

const createRouter = () => new WrappedNextRouter(Router);

export const WrappedNextRouterHolder: React.FunctionComponent = (props) => {
  const [wrappedRouter] = useState(createRouter);

  useEffect(() => {
    wrappedRouter.componentDidMount();
    return () => wrappedRouter.componentWillUnmount();
  }, []);

  return React.createElement(WrappedNextRouterContext.Provider, { value: wrappedRouter }, props.children);
};

export const useWrappedRouter = () => useContext(WrappedNextRouterContext);
