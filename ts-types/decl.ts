/**
 * Generate ts declarations (mostly basic types with names, and ADT types)
 * @copyright Wang Guan
 * FIXME consider type hierarchys
 */
import { TSType, TSObject } from './infer';

export class NamedType {
    constructor(public name: string, public type: TSType) {
    }

    generateCode() {
        const tokens = [this.name, ':'].concat(this.type.generateCode());
        if (!(this.type instanceof TSObject)) {
            tokens.push(';');
        }

        return tokens;
    }
}

export class TSInterface extends TSType {
    constructor(public name: string, public type: TSObject) {
        super();
    }
    generateCode() {
        return ['export', 'interface', this.name].concat(this.type.generateCode());
    }
}

export class NamedUnionType extends TSType {
    constructor(public name: string, public union: string[]) {
        super();
    }

    generateCode() {
        const tokens = ['export', 'type', this.name, ' = '];
        this.union.forEach((value, index, union) => {
            tokens.push(value);
            if (index < union.length - 1) {
                tokens.push(' | ');
            }
        });
        tokens.push(';');
        return tokens;
    }
}

/**
 * Simple: NO param names /  / etc.
 */
export class TSNamedSimpleFunction extends TSType {
    constructor(public name: string, public paramTypes: [TSType], public retType: TSType) {
        super();
    }

    /**
     * generates like
     */
    generateCode() {
        let tokens = [this.name, '('];
        this.paramTypes.forEach((value, index) => {
            tokens.push(`param${1 + index}`, ':', ...value.generateCode());
        });
        tokens.push(')', ':');
        tokens = tokens.concat(this.retType.generateCode());
        return tokens;
    }
}