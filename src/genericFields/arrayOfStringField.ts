import { box, textbox } from 'blessed';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function arrayOfStringField(parser: SchemaParser, key: string): void {
    let payload: string[] = [];

    const stringArrayPreview = box({
        border: 'line',
        height: '80%',
        label: key,
        left: 'center',
        parent: screen,
        shrink: true,
        top: '10%',
        width: '50%',
    });

    const input = textbox({
        bg: 'green',
        border: 'line',
        fg: 'black',
        height: 'shrink',
        left: 'center',
        parent: screen,
        shrink: true,
        top: '80%',
        width: '50%',
    });

    input.on('submit', (value: string) => {
        if (!value) {
            parser.setConfigValue(key, payload.length > 0 ? payload : undefined);
            screen.remove(stringArrayPreview);
            screen.remove(input);
            input.free();
            stringArrayPreview.free();
            screen.emit('repaint');
            return;
        }
        payload = [ ...payload, value ];
        stringArrayPreview.setContent(JSON.stringify(payload, null, 4));
        input.clearValue();
        input.readInput();
        screen.render();
    });

    input.onceKey('escape', () => input.emit('submit'));

    input.readInput();
    screen.render();
}
