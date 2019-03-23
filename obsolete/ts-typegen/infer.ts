/**
 * Infer TS types for a JSON-serializable value
 */
export function infer(value: any): TSType {
  const jsType = typeof value;
  if (value === null || value === undefined) {
    return new TSAny();
  }
  if (jsType === 'number' || value instanceof Number) {
    return new TSNumber();
  }
  if (jsType === 'string' || value instanceof String) {
    return new TSString();
  }
  if (jsType === 'boolean') {
    return new TSBoolean();
  }
  if (value instanceof Array) {
    return new TSArray(value);
  }
  if (jsType === 'object') {
    return new TSObject(value);
  }
  throw new Error(`cannot recognize value: {${value}}`);
}

/**
 * base class of (unnamed) types
 */
export abstract class TSType {
  /**
   * Generate code for this type
   * @return tokens
   */
  abstract generateCode(): string[];
}

/**
 * Can be used when ES6 named parameter is not avaiable (e.g. node v4)
 */
function namedArg<T>(absent: T, value?: T): T {
  return value === undefined ? absent : value;
}

/**
 * "any"
 */
class TSAny extends TSType {
  generateCode() {
    return [`any`];
  }
}

interface PropDict {
  [propName: string]: TSType;
}

/**
 * key (propName: string) -- value (propType: TSType) pairs
 */
export class TSObject extends TSType {
  private readonly propTypes: PropDict = {};
  private optional = false;

  constructor(value: any) {
    super();
    const keys = Object.keys(value);
    keys.forEach(k => {
      this.propTypes[k] = infer(value[k]);
    });
  }

  /**
   * set all props to be optional
   */
  setOptional(optional: boolean, recursive = false) {
    this.optional = optional;

    if (recursive) {
      for (const key in this.propTypes) {
        if (this.propTypes.hasOwnProperty(key)) {
          const propType = this.propTypes[key];
          if (propType instanceof TSObject) {
            propType.setOptional(optional);
          }
        }
      }
    }
  }

  generateCode() {
    let result: string[] = [];
    result.push('{');

    const keys = Object.keys(this.propTypes);
    keys.forEach(childName => {
      // TODO different grammer on functions
      const childType = this.propTypes[childName];
      let childTypeTokens = null;
      if (1 > 2) {
        childTypeTokens = childType.generateCode();
      } else {
        childTypeTokens = [this.optional ? `${childName}?` : childName, ':'].concat(childType.generateCode());
      }
      if (!(childType instanceof TSObject)) {
        childTypeTokens.push(';');
      }
      result = result.concat(childTypeTokens);
    });

    result.push('}');
    return result;
  }
}

/**
 * [a] (currently only homogeneous array is supported)
 *
 * FIXME support non-homogeneous array via union types
 */
class TSArray extends TSType {
  memberType: TSType;

  constructor(value: any[]) {
    super();
    if (value.length === 0) {
      this.memberType = new TSAny();
    } else {
      this.memberType = infer(value[0]);
    }
  }

  generateCode() {
    return this.memberType.generateCode().concat(['[]']);
  }
}

/**
 * type that is just a name
 * e.g. primitive types, or other types defined by name
 */
export class TSTypeRef extends TSType {
  constructor(private name: string) {
    super();
  }

  generateCode() {
    return [this.name];
  }
}

class TSNumber extends TSTypeRef {
  constructor() {
    super('number');
  }
}

export class TSString extends TSTypeRef {
  constructor() {
    super('string');
  }
}

class TSBoolean extends TSTypeRef {
  constructor() {
    super('boolean');
  }
}

/**
 * what else can void do? only be return value?
 */
class TSVoid extends TSTypeRef {
  constructor(a: void) {
    super('void');
  }
}
