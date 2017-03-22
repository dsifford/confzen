/**
 * Example: tslint "extends" field
 */
export interface StringOrStringArray extends JSONSchema {
    type: ['array', 'string'] | 'array';
    items: {
        type: 'string';
    };
}

export function isStringOrStringArray(field: JSONSchema): field is StringOrStringArray {
    if (!field.items || !field.type) { return false; }
    if (field.type === 'array' && (<any>field.items).type === 'string') { return true; }
    return Array.isArray(field.type)
        && field.type.length === 2
        && field.type.every(t => ['string', 'array'].indexOf(t) > -1)
        && (<any>field.items).type === 'string';
}

/**
 * Example: tslint "align" field
 */
export interface ArrayOfPrimitiveEnum extends JSONSchema {
    type?: ['array'] | 'array';
    items: {
        enum: Array<string | boolean | number>;
    };
}

export function isArrayOfPrimitiveEnum(field: JSONSchema): field is ArrayOfPrimitiveEnum {
    if (!field.items || !(<any>field.items).enum) { return false; }
    if (!Array.isArray(field.type) && field.type !== undefined && field.type !== 'array') { return false; }
    return (<any>field.items).enum.every(t => typeof t !== 'object');
}

/**
 * Example: tslint "cyclomatic-complexity" field
 */
export interface ArrayOfBooleanAndPrimitive extends JSONSchema {
    type: 'array';
    items: {
        type: ['boolean', ('number' | 'string')];
    };
}

export function isArrayOfBooleanAndPrimitive(field: JSONSchema): field is ArrayOfBooleanAndPrimitive {
    if (!field.items || !field.type || !Array.isArray((<any>field.items).type)) { return false; }
    return field.type === 'array'
        && (<any>field.items).type.every(t => ['boolean', 'number', 'string'].indexOf(t) !== -1);
}

/**
 * Checks to see if the passed in object is a "terminal" object (i.e., no further nesting)
 * @param obj An object to be tested
 */
export function isTerminalObject(obj: object): boolean {
    return Object.keys(obj).every(key => {
        if (key === 'additionalProperties') { return true; }
        return typeof obj[key] !== 'object';
    });
}
