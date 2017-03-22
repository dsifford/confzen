import { box, list as List, textbox } from 'blessed';
import SchemaParser from '../../runtime/schemaParser';
import { screen } from '../../widgets/';

interface Ignore {
    'ignore-pattern': string;
    'ignore-words': string[];
}

function generatePreview(payload: Set<string>, ignore: Ignore): string {
    const { 'ignore-words': words, 'ignore-pattern': pattern } = ignore;
    let json: any[] = [...payload]
        .filter(key => key !== 'ignore-pattern' && key !== 'ignore-words')
        .sort();
    if (words.length > 0) {
        json = [...json, { 'ignore-words': [...words] }];
    }
    if (pattern) {
        json = [...json, { 'ignore-pattern': pattern }];
    }
    return json.length === 0 ? '' : JSON.stringify([true, ...json], null, 4);
}

export function commentFormat(parser: SchemaParser, key: string): void {
    const payload: Set<string> = new Set();
    const ignore: Ignore = {
        'ignore-pattern': '',
        'ignore-words': [],
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
            'check-lowercase',
            'check-space',
            'check-uppercase',
            'ignore-pattern',
            'ignore-words',
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

    const input = textbox({
        bg: 'green',
        border: 'line',
        fg: 'black',
        height: 'shrink',
        hidden: true,
        left: 'center',
        parent: screen,
        top: 'center',
        width: 'half',
    });

    list.on('select', value => {
        const selection = value.getText();
        if (selection === '{center}Confirm{/center}') {
            list.emit('done');
            return;
        }
        if (selection === 'ignore-words') {
            if (payload.delete(selection)) {
                ignore[selection] = [];
            }
            payload.add(selection);
            list.emit(selection);
            return;
        }
        if (selection === 'ignore-pattern') {
            if (payload.delete(selection)) {
                ignore[selection] = '';
            }
            payload.add(selection);
            list.emit(selection);
            return;
        }
        // Toggles the selection in the set. If selection exists, the expression short-circuits.
        payload.delete(selection) || payload.add(selection);
        preview.setContent(generatePreview(payload, ignore));
        list.focus();
        screen.emit('repaint');
    });

    list.on('ignore-words', () => {
        const IW = 'ignore-words';
        input.setLabel(IW);
        input.show();
        input.readInput((_err, value) => {
            if (!value && ignore[IW].length === 0) {
                payload.delete(IW);
                input.hide();
                list.focus();
            }
            else if (!value) {
                input.hide();
                list.focus();
            }
            else {
                ignore[IW] = [...ignore[IW], value];
                input.clearValue();
                list.emit(IW);
            }
            preview.setContent(generatePreview(payload, ignore));
            screen.emit('repaint');
        });
        screen.emit('repaint');
    });

    list.on('ignore-pattern', () => {
        const IP = 'ignore-pattern';
        input.setLabel(IP);
        input.show();
        input.readInput((_err, value) => {
            if (!value) {
                payload.delete(IP);
            }
            else {
                ignore[IP] = value;
                input.clearValue();
            }
            input.hide();
            list.focus();
            preview.setContent(generatePreview(payload, ignore));
            screen.emit('repaint');
        });
        screen.emit('repaint');
    });

    list.once('done', () => {
        if (payload.size === 0) {
            parser.setConfigValue(key);
        }
        else {
            parser.setConfigValue(key, JSON.parse(generatePreview(payload, ignore)));
        }
        screen.remove(list);
        screen.remove(preview);
        screen.remove(input);
        input.free();
        list.free();
        preview.free();
        screen.emit('repaint');
    });

    list.focus();
    screen.render();

}
