/**
 * Utils to serialze and deserialize objects with its prototype chain
 * 
 * Idea:
 * 
 * - serialize JSON-representable part of instances, along with their prototype chains.
 * 
 * 
 * Pack:
 * - merely a string
 * - cannot contain function of any kind. Functions should be contained, and transferred with code of prototypes
 * - contains (recursive) own properties
 * - contains (recursive) ids of prototypes
 * 
 * Contract:
 * 
 * - Each prototype must be registered before use
 * - Prototypes *must* be immutable (this enables reuse of re-constructed prototype object).
 * - non JSON-serializable own-properties are ignored
 * - non enumerable properties are ignored (TODO: ensure this conforms to JSON.stringify)
 * - circular reference will be rejected, as in JSON.stringify()
 * - circular prototype chain will be rejected (TODO)
 * 
 * Compatibility:
 * - ES 6 and up
 * - ES 5.1 and up, when shim for Map presents (FIXME: ensure this)
 */

/**
 * values that can be serialized:
 * plain object
 *
 */

/**
 * TODO: consider
 * 
 * can we serialize symbol?
 */

export type Packed<T> = { _prototypeChain: string[]; } & { [propname: string]: Packed<any> }

/**
 * A object to hold Map<ProtoTypeId, serializer>
 */
interface IFactory {
    registerPrototype<T>(id: string, prototype: object): this;

    // pack<T>(object: T): Packed<T>

    unpack<T>(from: Packed<T>): T;

    /**
     * a ObjectFactory must be freeze-d before calling pack / unpack
     * 
     * ensures prototype graph does not change
     */
    // freeze(): this
}

const EmptyPrototypeChain: string[] = [];

export class Factory implements IFactory {

    // FIXME should replace Map for Object? can we use a shim?
    private readonly protomap = new Map<string, object>();

    registerPrototype<T>(id: string, prototype: object) {
        const existing = this.protomap.get(id);
        if (existing && existing === prototype) {
            throw new SerializerError(`Duplicate ProtoTypeId: ${id}`);
        } else if (!(prototype instanceof Object)) {
            throw new SerializerError(`prototype cannot be null`);
        }
        this.protomap.set(id, prototype);
        return this
    }

    private getPrototype(id: string): object {
        const got = this.protomap.get(id);
        if (!got)
            throw new SerializerError(`prototype for id=${id} not found`);
        return got;
    }

    unpack<T>(from: Packed<T>) {
        const unpacked = Object.assign({}, from);
        // TODO traverse properties of obj, and replace
        this.expandPrototypeId(unpacked);
        return unpacked;
    }

    expandPrototypeId(obj: Packed<any>) {
        const prototypes = obj._prototypeChain || EmptyPrototypeChain;
        delete obj._prototypeChain;
        Object.setPrototypeOf(obj, this.createPrototype(prototypes));
    }

    createPrototype(ids: string[]): object {
        if (!ids.length)
            return Object.prototype;

        const p1 = this.getPrototype(ids[0]);
        const obj1 = Object.assign({}, p1);

        const pRest = this.createPrototype(ids.slice(1));
        Object.setPrototypeOf(obj1, pRest);
        return obj1;
    }

    private validatePrototypeGraph() {

    }
}

class SerializerError extends Error { }