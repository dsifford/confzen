import { box, list as List } from 'blessed';
import { stringToPrimitive } from '../runtime/helpers';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

type Primitive = string|number|boolean;

function sortPrimitiveArray(arr: Primitive[]): Primitive[] {
    const sorted = arr.reduce((prev, curr) => {
        prev[typeof curr] = [ ...prev[typeof curr], curr].sort();
        return prev;
    }, { boolean: [], number: [], string: [] });
    return [ ...sorted.boolean, ...sorted.number, ...sorted.string ];
}

function prependBooleanIfMissing(arr: Primitive[], fixRequired: boolean): Primitive[] {
    if (!fixRequired) { return arr; }
    return arr.every(i => typeof i !== 'boolean')
        ? [ true, ...arr ]
        : [ ...arr ];
}

export function arrayOfEnumField(parser: SchemaParser, key: string): void {
    const payload: Set<Primitive> = new Set();
    const currentIndex = parser.index;
    const items = sortPrimitiveArray(currentIndex[key].items.enum);
    const HAS_BOOLEAN_TOGGLE = items.indexOf(true) !== -1 && items.indexOf(false) !== -1;

    const preview = box({
        border: 'line',
        height: '80%',
        left: '50%',
        parent: screen,
        shrink: true,
        top: 'center',
        width: '30%',
    });

    const list = List({
        border: 'line',
        height: '80%',
        items: [
            '{center}{bold}Confirm{/bold}{/center}',
            ...[...items].map(i => i.toString()),
        ],
        keys: true,
        label: key,
        left: '20%',
        parent: screen,
        shrink: true,
        style: {
            selected: {
                bg: 'green',
                bold: true,
                fg: 'black',
            },
        },
        tags: true,
        top: 'center',
        vi: true,
        width: '30%',
    });

    list.on('select', value => {
        const selection = value.getText();
        if (selection === '{center}Confirm{/center}') {
            parser.setConfigValue(
                key,
                payload.size > 0
                    ? prependBooleanIfMissing(sortPrimitiveArray([...payload]), HAS_BOOLEAN_TOGGLE)
                    : undefined,
            );
            screen.remove(list);
            screen.remove(preview);
            list.free();
            preview.free();
        }
        else {
            // Toggles the selection in the set. If selection exists, the expression short-circuits.
            const selectionValue = stringToPrimitive(selection);
            payload.delete(selectionValue) || payload.add(selectionValue);
            preview.setContent(JSON.stringify(sortPrimitiveArray([...payload]), null, 4));
            list.focus();
        }
        screen.emit('repaint');
    });

    list.focus();
    screen.render();
}
