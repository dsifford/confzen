// import { writeFileSync } from 'fs';
// import { join } from 'path';
import Dispatcher from './complexFields/';
import { FILENAMES } from './constants';
import genericFields from './genericFields/';
import Config from './runtime/config';
import * as t from './runtime/fieldTypes';
import getSchema, { ConfigKind } from './runtime/getSchema';
import SchemaParser from './runtime/schemaParser';
import { configTypePicker, confirmation, listGroup, preview, screen } from './widgets/';

let CONFIG_TYPE: ConfigKind;
let config: Config;
let dispatcher: Dispatcher;
let parser: SchemaParser;

screen.render();

screen.once('configTypeSelected', init);
screen.on('descriptionChange', renderFieldDescription);
screen.on('fieldSelected', handleUserInput);
screen.on('finalize', finalize);
screen.on('focus-pane', focusPane);
screen.on('paginate', paginate);
screen.on('repaint', repaint);

/**
 * Abstractions
 */

function init(configType: ConfigKind): void {
    CONFIG_TYPE = configType;
    config = new Config(FILENAMES[CONFIG_TYPE]);

    const schemaPromise = getSchema(CONFIG_TYPE);
    const configPromise = config.getFile();

    Promise.all([schemaPromise, configPromise]).then(([schema, conf]) => {
        parser = new SchemaParser(schema, CONFIG_TYPE, conf);
        dispatcher = new Dispatcher(parser);

        preview.setLabel(FILENAMES[CONFIG_TYPE]);

        screen.remove(configTypePicker);
        configTypePicker.free();

        screen.append(listGroup.container);
        screen.append(preview);

        paginate();
        screen.emit('repaint');
        // writeFileSync(join(__dirname, '../test.json'), JSON.stringify(parser.parsed, null, 4));
    });
}

function finalize() {
    return confirmation(parser, config);
}

function handleUserInput(key: string): void {
    const currentIndex = parser.index;

    if (dispatcher.dispatch(CONFIG_TYPE, key)) {
        return;
    }

    if (currentIndex[key].enum) {
        return genericFields.enum(parser, key);
    }

    if (t.isStringOrStringArray(currentIndex[key])) {
        return genericFields.arrayOf.string(parser, key);
    }

    if (t.isArrayOfPrimitiveEnum(currentIndex[key])) {
        return genericFields.arrayOf.enum(parser, key);
    }

    if (t.isArrayOfBooleanAndPrimitive(currentIndex[key])) {
        return genericFields.arrayOf.booleanAndPrimitive(parser, key);
    }

    switch (currentIndex[key].type) {
        case 'object':
            if (t.isTerminalObject(currentIndex[key])) {
                return genericFields.object(parser, key);
            }
            return paginate(key);
        case 'string':
            return genericFields.string(parser, key);
        case 'boolean':
            return genericFields.boolean(parser, key);
        case 'number':
            return genericFields.number(parser, key);
        default:
            return genericFields.fallback(parser, key);
    }
}

function paginate(key?: string): void {
    const indexKey = parser.indexKey;
    const index = key ? parser.addIndex(key).index : parser.dropIndex().index;
    const items = Object.keys(index).filter(k => typeof index[k] === 'object').sort();
    const breadcrumbs = parser.breadcrumbs;

    listGroup.list.setItems(<any>items);

    if (indexKey !== '') {
        const parentIndex: any = listGroup.list.fuzzyFind(indexKey);
        listGroup.list.select(parentIndex);
    }
    else {
        listGroup.list.select(0);
    }

    if (breadcrumbs) {
        listGroup.list.setLabel(breadcrumbs);
    }
    else {
        listGroup.list.removeLabel();
    }

    listGroup.list.focus();
    listGroup.list.render();
}

function repaint(): void {
    preview.setContent(JSON.stringify(parser.config, null, 4));
    preview.setScrollPerc(100); // FIXME: Should we keep this?
    screen.render();
}

function renderFieldDescription(key: string): void {
    const index = parser.index[key];
    if (!index) { return; }
    listGroup.descriptionText.setText(index.description || '');
    screen.render();
}

function focusPane(pane: 'list'|'preview') {
    return pane === 'list' ? listGroup.list.focus() : preview.focus();
}
