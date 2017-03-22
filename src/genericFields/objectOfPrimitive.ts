import { box, textbox } from 'blessed';
import { stringToPrimitive } from '../runtime/helpers';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function objectOfPrimitiveField(parser: SchemaParser, key: string): void {
    const payload = {};

    const preview = box({
        border: 'line',
        height: '80%',
        label: key,
        left: 'center',
        parent: screen,
        shrink: true,
        top: 'center',
        width: '50%',
    });

    const keyInput = textbox({
        border: 'line',
        height: 'shrink',
        label: 'key',
        left: '25%',
        parent: screen,
        shrink: true,
        style: {
            focus: {
                bg: 'green',
                fg: 'black',
            },
        },
        top: '80%',
        width: '27%',
    });

    const valueInput = textbox({
        border: 'line',
        height: 'shrink',
        label: 'value',
        left: '50%',
        parent: screen,
        shrink: true,
        style: {
            focus: {
                bg: 'green',
                fg: 'black',
            },
        },
        top: '80%',
        width: '25%',
    });

    keyInput.on('submit', (value: string) => {
        if (!value) {
            parser.setConfigValue(key, Object.keys(payload).length > 0 ? payload : undefined);
            keyInput.emit('exit');
            return;
        }
        valueInput.readInput();
    });

    valueInput.on('submit', (value: string) => {
        if (value) {
            const currentKey = keyInput.getText();
            payload[currentKey] = stringToPrimitive(value);
            preview.setContent(JSON.stringify(payload, null, 4));
        }
        valueInput.clearValue();
        keyInput.clearValue();
        keyInput.readInput();
        screen.render();
    });

    keyInput.once('exit', () => {
        screen.remove(preview);
        screen.remove(keyInput);
        screen.remove(valueInput);
        preview.free();
        keyInput.free();
        valueInput.free();
        screen.emit('repaint');
        return;
    });

    keyInput.onceKey('escape', () => keyInput.emit('exit'));
    valueInput.onceKey('escape', () => keyInput.emit('exit'));

    keyInput.readInput();
    screen.render();
}
