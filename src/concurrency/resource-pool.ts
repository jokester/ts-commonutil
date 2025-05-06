import { ResourcePool as ResourcePoolBasic } from './resource-pool-basic';

/**
 * @note if this fails to compile, import from 'resource-pool' instead
 */
export class ResourcePool<T> extends ResourcePoolBasic<T> {
  override async use<R>(task: (res: T) => R): Promise<Awaited<R>> {
    await using lease = await this.borrow();
    // noinspection ES6RedundantAwait
    return await task(lease.value);
  }
}
