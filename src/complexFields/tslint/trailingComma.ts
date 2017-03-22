import { box, list as List } from 'blessed';
import { stringToPrimitive } from '../../runtime/helpers';
import SchemaParser from '../../runtime/schemaParser';
import { screen } from '../../widgets/';

function generatePreview(payload: Set<string>, options): string {
    const sorted = [...payload].reduce((arr, value) => {
        if (value === 'multiline' || value === 'singleline') {
            arr[1] = [...arr[1], { [value]: options[value] }];
            return arr;
        }
        arr[0] = [...arr[0], stringToPrimitive(value)];
        return arr;
    }, <any>[[], []]);
    return JSON.stringify([...sorted[0], ...sorted[1]], null, 4);
}

export function trailingComma(parser: SchemaParser, key: string): void {
    const payload: Set<string> = new Set();
    const options = {
        multiline: '',
        singleline: '',
    };

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
            'false',
            'true',
            'multiline',
            'singleline',
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
            list.emit('done');
            return;
        }
        if (['multiline', 'singleline'].indexOf(selection) !== -1) {
            switch (options[selection]) {
                case 'always':
                    options[selection] = 'never';
                    break;
                case 'never':
                    options[selection] = '';
                    payload.delete(selection);
                    break;
                default:
                    options[selection] = 'always';
                    payload.add(selection);
            }
        }
        else if (selection === 'true') {
            payload.delete('false');
            // Toggles the selection in the set. If selection exists, the expression short-circuits.
            payload.delete(selection) || payload.add(selection);
        }
        else {
            payload.delete('true');
            // Toggles the selection in the set. If selection exists, the expression short-circuits.
            payload.delete(selection) || payload.add(selection);

        }
        preview.setContent(generatePreview(payload, options));
        list.focus();
        screen.emit('repaint');
    });

    list.once('done', () => {
        if (payload.size === 0) {
            parser.setConfigValue(key);
        }
        else {
            parser.setConfigValue(key, JSON.parse(generatePreview(payload, options)));
        }
        screen.remove(list);
        screen.remove(preview);
        list.free();
        preview.free();
        screen.emit('repaint');
    });

    list.focus();
    screen.render();

}
