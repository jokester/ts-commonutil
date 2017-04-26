/**
 * Generate TS decl for options in node-libtidy
 * @author Wang Guan <momocraft@gmail.com>
 */

import * as dom from 'dts-dom';
import * as lodash from 'lodash';
import * as libtidy from 'libtidy';
import * as chai from 'chai';

function createConstUnion(values: (number | string)[]) {
    const v = values.map(_ => lodash.isString(_) ? JSON.stringify(_) : _);
    const u = v.map(_ => dom.create.namedTypeReference(<any>v));
    return dom.create.union(u);
}

/**
 * convert "skip-nested" to "skip_nested"
 * @param optionName name in '-' notation
 */
function underscoreName(optionName: string) {
    return optionName.replace(/-/g, '_');
}

function camelCaseName(optionName: string) {
    return optionName
        .split('-')
        .map(lodash.upperFirst)
        .join('');
}

function enumerateNames(optionName: string) {
    const name1 = optionName;
    const name2 = underscoreName(optionName);
    const name3 = camelCaseName(optionName);
    return lodash.uniq([name1, name2, name3]);
}

/**
 *
 *
 * @param {libtidy.TidyOption} o the option
 * @returns {dom.Type} A union type that can be used to set/get the option
 */
function nameUnion(o: libtidy.TidyOption): dom.Type {
    const names = enumerateNames(o.name).map(n => JSON.stringify(n));

    const t = (names.length === 1)
        ? dom.create.namedTypeReference(names[0])
        : dom.create.union(names.map(dom.create.namedTypeReference));
    return t;
}

/**
 * create a unfolded type
 * @param o
 */
function valueType(o: libtidy.TidyOption): dom.Type {

    switch (o.type) {
        case "integer":
        case "boolean":
        case "string":
            break;
        default:
            throw new Error(`not implemented`);
    }

    if (o.type === "integer") {
        if (!o.pickList.length) {
            return dom.create.namedTypeReference("number");
        }

        // If the picklist
        const pickListNumbers = o.pickList
            .map(v => +(v.match(/^\d+/) || [])[0]);

        if (pickListNumbers.every(v => !isNaN(v))) {
            const u = pickListNumbers.map(<any>dom.create.namedTypeReference);
            return dom.create.union(<any>u);
        } else {
            const u = o.pickList
                .map(v => JSON.stringify(v))
                .map(<any>dom.create.namedTypeReference);
            return dom.create.union(<any>u);
        }
    } else if (o.type === "string") {

        if (!o.pickList.length) {
            return dom.create.namedTypeReference("string");
        }
        return dom.create.union(
            o.pickList.map(v => dom.create.namedTypeReference(JSON.stringify(v)))
        )

    } else if (o.type === "boolean") {
        return dom.create.namedTypeReference("boolean");
    }

    console.error(o);
    throw new Error(`not implemented`);
}

function main() {
    const doc = new libtidy.TidyDoc() as any;
    const options = doc.getOptionList();

    const nm = dom.create.namespace("Generated");
    nm.flags = dom.DeclarationFlags.None;
    nm.jsDocComment = `Type for libtidy options
@generated from, with dts-dom
{@link }
    `.trim();

    const optionDict = dom.create.interface("OptionDict");
    const optAccessors = dom.create.interface('TidyDocOption');

    for (const o of options) {
        if (o.type === "boolean") {
            chai.expect(typeof doc.optGet(o)).eq("boolean");
            chai.expect(typeof doc.optGet(o.name)).eq("boolean");
        }
    }

    for (const o of options) {
        const values = valueType(o);
        const v = dom.create.alias(underscoreName(o.name), values);
        try {
            // nm.members.push(v);
        } catch (e) {
            console.error(o);
            throw e;
        }

        const getOpt = dom.create.method("optGet",
            [dom.create.parameter("key", nameUnion(o))],
            valueType(o));

        getOpt.jsDocComment = o.name;

        optAccessors.members.push(getOpt)

        optAccessors.members.push(
            dom.create.method("optSet",
                [dom.create.parameter("key", nameUnion(o)), dom.create.parameter("value", valueType(o))],
                dom.create.namedTypeReference("void")
            )
        )

        optionDict.members.push(
            dom.create.property(
                underscoreName(o.name),
                valueType(o),
                dom.DeclarationFlags.Optional));

        optionDict.members.push(
            dom.create.property(
                camelCaseName(o.name),
                valueType(o),
                dom.DeclarationFlags.Optional));
    }
    nm.members.push(optAccessors);
    nm.members.push(optionDict);
    console.log(dom.emit(nm).replace("declare namespace", "namespace"));
}

main();
