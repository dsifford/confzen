import { list as List, textbox } from 'blessed';
import { stringToPrimitive } from '../runtime/helpers';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function arrayOfBooleanAndPrimitiveField(parser: SchemaParser, key: string): void {

    const list = List({
        border: 'line',
        height: '50%',
        items: [
            'false',
            'true',
            'unset',
        ],
        keys: true,
        label: key,
        left: 'center',
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
        vi: true,
        width: '50%',
    });

    const input = textbox({
        border: 'line',
        height: 'shrink',
        label: 'key',
        left: 'center',
        parent: screen,
        shrink: true,
        style: {
            focus: {
                bg: 'green',
                fg: 'black',
            },
        },
        top: '40%',
        width: '50%',
    });

    list.once('select', value => {
        const selection = value.getText();

        switch (selection) {
            case 'true':
                input.readInput();
                screen.emit('repaint');
                return;
            case 'false':
                parser.setConfigValue(key, [false]);
                break;
            default:
                parser.setConfigValue(key);
                break;
        }

        screen.remove(list);
        screen.remove(input);

        list.free();
        input.free();

        screen.emit('repaint');
    });

    input.once('submit', value => {
        parser.setConfigValue(key, value ? stringToPrimitive(value) : undefined);

        screen.remove(list);
        screen.remove(input);

        list.free();
        input.free();

        screen.emit('repaint');
    });

    input.onceKey('escape', () => input.emit('submit'));

    list.focus();
    screen.render();
}
