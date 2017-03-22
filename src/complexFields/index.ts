import { ConfigKind } from '../runtime/getSchema';
import SchemaParser from '../runtime/schemaParser';
import babel from './babel/';
import tsconfig from './tsconfig/';
import tslint from './tslint/';

interface Field {
    [k: string]: (parser: SchemaParser, key: string) => void;
};

interface FieldGroup {
    [k: string]: Field;
};

const fields: FieldGroup = {
    babel,
    tsconfig,
    tslint,
};

function formatCamelCase(key: string): string {
    return key.replace(/-\w/g, match => `${match.slice(1).toUpperCase()}`);
}

export default class Dispatcher {
    constructor(private parser: SchemaParser) {};
    public dispatch(configType: ConfigKind, key: string): boolean {
        key = formatCamelCase(key);
        if (!fields[configType] || !fields[configType][key]) {
            return false;
        }
        fields[configType][key](this.parser, key);
        return true;
    }
}
