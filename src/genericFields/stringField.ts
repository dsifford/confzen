import { textbox } from 'blessed';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function stringField(parser: SchemaParser, key: string): void {
    const input = textbox({
        bg: 'green',
        border: 'line',
        fg: 'black',
        height: 'shrink',
        label: key,
        left: 'center',
        parent: screen,
        top: 'center',
        width: 'half',
    });

    input.once('submit', value => {
        parser.setConfigValue(key, value === '' ? undefined : value);
        screen.remove(input);
        input.free();
        screen.emit('repaint');
    });

    input.onceKey('escape', () => input.emit('submit'));

    input.readInput();
    screen.render();
}
