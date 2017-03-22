import { IGNORED_FIELDS } from '../constants';
import { ConfigKind } from './getSchema';

/**
 * Used for parsing, paginating, and operating on a JSON schema.
 */
export default class SchemaParser {

    /** Raw JSON schema used for validation at the end. */
    public schema: JSONSchema;

    /** JSON schema with references / combinations resolved */
    public parsed: JSONSchema;

    /**
     * An array of strings representing the level currently nested in the schema.
     *
     * For example, if we're operating on the tsconfig.json schema and the current
     * page is `compilerOptions`, the shape of `_index` would be `['compilerOptions', 'properties']`
     */
    private _index: string[] = [];

    /** Config output */
    private _config: object;

    /** Type of config file being processed */
    private readonly CONFIG_TYPE: ConfigKind;

    /** List of ignored fields to skip over */
    private readonly ignoredFields: string[];

    constructor(schema: JSONSchema, kind: ConfigKind, config: object) {
        this.CONFIG_TYPE = kind;
        this.schema = schema;
        this.ignoredFields = IGNORED_FIELDS[kind];
        this.parsed = this.parse({ ...schema });
        this._config = { ...this.parseBlankConfig(this.parsed), ...config };
    }

    /**
     * Returns a string representing the position currently at in the configuration
     * object in the form of "parent > child > grandchild"
     */
    public get breadcrumbs(): string {
        const keys = this._index.filter(key => key !== 'properties');
        return keys.map((key, i) => (
            i === keys.length - 1 ? key : `${key}{bold} > {/bold}`
        )).join('');
    }

    /**
     * Resolves to the value of `this._config`, but without empty fields.
     */
    public get config(): object {
        return Object.keys(this._config).reduce((conf, key) => {
            const item = this._config[key];
            if (item === undefined) {
                return conf;
            }
            if (typeof item === 'string') {
                return { ...conf, [key]: item };
            }
            if (typeof item === 'boolean') {
                return { ...conf, [key]: item };
            }
            if (Array.isArray(item)) {
                return item.length > 0
                    ? { ...conf, [key]: [...item] }
                    : conf;
            }
            if (typeof item === 'object' && Object.keys(item).length === 0) {
                return conf;
            }
            return { ...conf, [key]: { ...item } };
        }, {});
    }

    /**
     * Resolves the value of the current level of the schema.
     */
    public get index(): JSONSchema {
        return this._index.reduce((schema, key) => {
            return schema[key];
        }, { ...this.parsed } );
    }

    /**
     * Returns the key of the currently selected index
     */
    public get indexKey(): string {
        const filtered = this._index.filter(i => i !== 'properties');
        return filtered[filtered.length - 1] || '';
    }

    /**
     * Appends a given key to `this._index`. If the resolved value of the
     * current index has a top-level "properties" key, "properties" is also appended
     * after the passed in key so that the index resolves to the fields.
     *
     * @param key key name of the next level being added to `_index`
     */
    public addIndex(key: string): this {
        this._index = [ ...this._index, key ];
        if (this.index.properties) {
            this.addIndex('properties');
        }
        return this;
    }

    /**
     * Removes either the last key from `this._index` or the last two keys
     * from `this._index` if the current resolved index is within a "properties" object.
     */
    public dropIndex(): this {
        if (this._index[this._index.length - 1] === 'properties') {
            this._index = this._index.slice(0, -2);
        }
        else {
            this._index = this._index.slice(0, -1);
        }
        return this;
    }

    /**
     * Sets or unsets a property value in the configuration object depending
     * on the presence or absence of "value".
     * @param key Key of the property that is being modified.
     * @param value Value being set.
     */
    public setConfigValue(key: string, value?: any): void {
        const keys = this._index.filter(k => k !== 'properties');
        const config = [...keys].reduce((conf, k) => {
            if (conf[k] === undefined) {
                conf[k] = {};
            }
            return conf[k];
        }, this._config);
        if (value === undefined) {
            if (config[key] !== undefined) { delete config[key]; }
            return;
        }
        config[key] = value;
    }

    /**
     * Retrieves the value of a property at the current index.
     * @param key Key of the property of interest.
     */
    public getConfigValue(key: string): any {
        const keys = this._index.filter(k => k !== 'properties');
        const config = [...keys].reduce((conf, k) => {
            if (conf[k] === undefined) {
                conf[k] = {};
            }
            return conf[k];
        }, this._config);
        return config[key];
    }

    /**
     * Takes a JSON schema as input and resolve all references and meta schemas.
     * @param schema A raw JSON schema.
     */
    private parse(schema: JSONSchema): object {
        return Object.keys(schema).reduce((prev, curr) => {
            // Resolve references
            if (curr === '$ref' && schema.$ref) {
                const ref = schema.$ref.slice(2).split('/').reduce((root, key) => {
                    return root[key];
                }, { ...this.schema });
                return { ...prev, ...this.parse(ref) };
            }

            // Resolve meta combinations
            if (['allOf', 'anyOf', 'oneOf'].indexOf(curr) > -1) {
                return { ...prev, ...this.reduceCombinationSchema(schema[curr]) };
            }

            // Step through properties and resolve any references / combinations found
            if (curr === 'properties' && schema[curr] !== undefined) {
                return { ...prev, ...this.parseProperties(<any>schema[curr]) };
            }

            // Stub out unnecessary fields
            if (curr === 'definitions' || curr === '$schema') { return prev; }

            return { ...prev, [curr]: schema[curr] };
        }, {});
    }

    /**
     * Takes an object of properties as input, resolves all references, removes any
     * ignored fields and returns the parsed object.
     * @param properties A "properties" map from a JSON schema.
     */
    private parseProperties(properties: object): object {
        return Object.keys(properties).reduce((props, key) => {
            const prop = properties[key];
            if (prop.$ref || prop.anyOf || prop.allOf || prop.oneOf) {
                return { ...props, [key]: this.parse(properties[key]) };
            }
            if (prop.properties) {
                return { ...props, [key]: this.parseProperties(prop.properties) };
            }
            if (this.ignoredFields.indexOf(key) !== -1) { return props; }
            return { ...props, [key]: properties[key] };
        }, { type: 'object' });
    }

    /**
     * Resolves combination schemas and returns the parsed object.
     * @param schemas A list of "combination"-type properties from a JSON schema.
     */
    private reduceCombinationSchema(schemas: JSONSchema[]): object {
        return schemas.reduce((prev, curr) => {
            return { ...prev, ...this.parse(curr) };
        }, {});
    }

    /**
     * Takes a JSON schema as input and returns an empty configuration object
     * in the specified shape.
     * @param schema JSON schema.
     */
    private parseBlankConfig(schema: JSONSchema): object {
        return Object.keys(schema).reduce((conf, key) => {
            if (typeof schema[key] === 'object') {
                return { ...conf, [key]: undefined };
            }
            return conf;
        }, {});
    }
}
