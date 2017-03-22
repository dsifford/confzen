import { textbox } from 'blessed';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function numberField(parser: SchemaParser, key: string): void {
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

    input.on('submit', (value: string) => {
        const number = parseInt(value, 10);
        // Invalid input -- Clear and ask again
        if (isNaN(number) && value.length > 0) {
            input.clearValue();
            input.readInput();
        }
        // Valid or empty input -- Set value and exit
        else {
            parser.setConfigValue(key, value ? number : undefined);
            screen.remove(input);
            input.free();
        }
        screen.emit('repaint');
    });

    input.onceKey('escape', () => input.emit('submit'));

    input.readInput();
    screen.render();
}
