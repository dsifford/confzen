import { get } from 'http';

export type ConfigKind = 'babel'|'eslint'|'tslint'|'typescript';

type Schema = { [k in ConfigKind]: string };
const SCHEMAS: Schema = {
    babel: 'http://json.schemastore.org/babelrc',
    eslint: 'http://json.schemastore.org/eslintrc',
    tslint: 'http://json.schemastore.org/tslint',
    typescript: 'http://json.schemastore.org/tsconfig',
};

export default function getSchema(name: ConfigKind): Promise<JSONSchema> {
    return new Promise((resolve, reject) => {
        let data = '';
        get(SCHEMAS[name], res => {
            res.setEncoding('utf-8');
            res.on('data', chunk => data += chunk);
            res.on('error', reject);
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
    });
}
