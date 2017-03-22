import { readFile, writeFile } from 'fs';
import * as json5 from 'json5';
import * as minimist from 'minimist';
import { join, resolve } from 'path';

export default class Config {
    private readonly argv: minimist.ParsedArgs;
    private readonly filename: string;
    private readonly path: string;
    private readonly filePath: string;

    constructor(filename: string) {
        this.filename = filename;
        this.argv = minimist(process.argv.slice(2));
        this.path = this.argv._[0] ? resolve(process.cwd(), this.argv._[0]) : process.cwd();
        this.filePath = join(this.path, this.filename);
    }
    public getFile(): Promise<object> {
        return new Promise(res => {
            readFile(this.filePath, 'utf-8', (err, data) => {
                if (err) { res({}); }
                try {
                    data = json5.parse(data);
                    res(data);
                }
                catch (e) {
                    res({});
                }
            });
        });
    }
    public setFile(data: object): Promise<boolean> {
        return new Promise(res => {
            writeFile(this.filePath, JSON.stringify(data, null, 4), err => {
                if (err) { throw err; }
                res(true);
            });
        });
    }
}
