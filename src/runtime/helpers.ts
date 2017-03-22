
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
            case 'object':
                return Object.keys(a)[0] < Object.keys(b)[0] ? -1 : 1;
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
        case !isNaN(Number.parseFloat(value)):
            return Number.parseFloat(value);
        default:
            return value;
    }
}

export function deepSortObject(obj: object): object {
    return Object.keys(obj).sort().reduce((sorted, key) => {
        if (Array.isArray(obj[key])) {
            sorted[key] = [...obj[key]];
            return sorted;
        }
        if (typeof obj[key] === 'object') {
            sorted[key] = deepSortObject(obj[key]);
            return sorted;
        }
        sorted[key] = obj[key];
        return sorted;
    }, {});
}
