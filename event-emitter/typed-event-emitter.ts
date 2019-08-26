import eventemitter3 from 'eventemitter3';

type Listener<EventMap extends {}, K extends keyof EventMap, Ret = void> = (ev: EventMap[K]) => Ret;

/**
 * Refined to simpler API / typed events
 */
export class TypedEventEmitter<EventMap extends {}> {
  private readonly realE = new eventemitter3.EventEmitter<string & keyof EventMap>();

  on<K extends keyof EventMap & string>(event: K, listener: Listener<EventMap, K>) {
    this.realE.on(event, listener);
    return this;
  }

  once<K extends keyof EventMap & string>(event: K, listener: Listener<EventMap, K>) {
    this.realE.once(event, listener);
    return this;
  }

  protected onceInternal<T>(event: string, listener: (v: T) => void) {
    this.realE.once(event as any, listener);
    return this;
  }

  protected emitInternal(event: string, value: any) {
    this.realE.emit(event as any, value);
    return this;
  }

  smartOnce<K extends keyof EventMap & string>(event: K, listener: Listener<EventMap, K, boolean>) {
    const actualListener: Listener<EventMap, K> = (ev: EventMap[K]) => {
      if (listener(ev)) {
        this.realE.removeListener(event, actualListener);
      }
    };

    this.realE.on(event, actualListener);

    return this;
  }

  emit<K extends keyof EventMap & string>(event: K, value: EventMap[K]) {
    this.realE.emit(event, value);
    return this;
  }
}
