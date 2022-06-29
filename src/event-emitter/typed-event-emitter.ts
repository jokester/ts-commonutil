import eventemitter3 from 'eventemitter3';

// eslint-disable-next-line @typescript-eslint/ban-types
type EventMapValue = object;

type Listener<EventMap extends Record<string, EventMapValue>, K extends keyof EventMap, Ret = void> = (
  ev: EventMap[K],
) => Ret;

/**
 * Refined to simpler API / typed events
 */
export class TypedEventEmitter<EventMap extends Record<string, EventMapValue>> {
  private readonly realE = new eventemitter3.EventEmitter<string & keyof EventMap>();

  on<K extends string & keyof EventMap>(event: K, listener: Listener<EventMap, K>) {
    this.realE.on(event as any, listener as any);
    return this;
  }

  once<K extends keyof EventMap & string>(event: K, listener: Listener<EventMap, K>) {
    this.realE.once(event as any, listener as any);
    return this;
  }

  protected onceInternal<T>(event: string, listener: (v: T) => void) {
    this.realE.once(event as any, listener as any);
    return this;
  }

  protected emitInternal(event: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.realE.emit(event, value);
    return this;
  }

  smartOnce<K extends keyof EventMap & string>(event: K, listener: Listener<EventMap, K, boolean>) {
    const actualListener: Listener<EventMap, K> = (ev: EventMap[K]) => {
      if (listener(ev)) {
        this.realE.removeListener(event as any, actualListener as any);
      }
    };

    this.realE.on(event as any, actualListener as any);

    return this;
  }

  emit<K extends keyof EventMap & string>(event: K, value: EventMap[K]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.realE.emit(event, value);
    return this;
  }
}
