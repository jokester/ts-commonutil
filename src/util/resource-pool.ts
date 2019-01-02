/**
 * A resource pool to share resources to (mutex) tasks
 * tasks are started in a FIFO way
 *
 * - NOT supported: replace / refresh / timeout of tasks
 */
export class ResourcePool<T> {
  static from1<T>(res: T) {
    return new ResourcePool([res]);
  }

  static fromMany<T>(resArray: T[]) {
    return new ResourcePool(resArray);
  }

  private consumers: ((res: T) => void)[] = [];
  private readonly initialSize: number;

  constructor(private readonly resources: T[]) {
    this.initialSize = resources.length;
  }

  get freeCount() {
    return this.resources.length;
  }

  async queue<R>(task: (res: T) => Promise<R>): Promise<R> {
    const r = await this.borrow();
    try {
      return await task(r);
    } finally {
      this.resources.push(r);
      this.balance();
    }
  }

  private async borrow(): Promise<T> {
    return new Promise<T>(f => {
      this.consumers.push(f);
      this.balance();
    });
  }

  private balance() {
    while (this.resources.length && this.consumers.length) {
      const r = this.resources.shift()!;
      const c = this.consumers.shift()!;
      c(r);
    }
  }
}
