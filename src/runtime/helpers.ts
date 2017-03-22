
export function sortMixedArray(a: any, b: any): number {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === 'string') {
        switch (typeB) {
            case 'boolean':
            case 'number':
                return 1;
            case 'object':
                return -1;
            default:
                return a < b ? -1 : 1;
        }
    }
    if (typeA === 'number') {
        switch (typeB) {
            case 'string':
            case 'object':
                return -1;
            case 'boolean':
                return 1;
            default:
                return a < b ? -1 : 1;
        }
    }
    if (typeA === 'boolean') {
        switch (typeB) {
            case 'boolean':
                return a === true ? -1 : 1;
            default:
                return -1;
        }
    }
    if (typeA === 'object') {
        switch (typeB) {
            case 'boolean':
            case 'number':
            case 'string':
                return 1;
            default:
                return -1;
        }
    }
    return -1;
}

export function stringToPrimitive(value: string): string|number|boolean {
    switch (true) {
        case value === 'true' || value === 'false':
            return value === 'true';
        case !isNaN(parseInt(value, 10)):
            return parseInt(value, 10);
        default:
            return value;
    }
}
