import { message, textarea } from 'blessed';
import * as json5 from 'json5';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function textEditorInput(parser: SchemaParser, key: string) {
    const editor = textarea({
        alwaysScroll: true,
        border: 'line',
        height: '80%',
        inputOnFocus: true,
        keys: true,
        label: `${key} (submit: esc, editor: C-e)`,
        left: 'center',
        parent: screen,
        scrollable: true,
        style: {
            focus: {
                border: {
                    fg: 'blue',
                },
            },
        },
        top: 'center',
        vi: true,
        width: 'half',
    });

    const msg = message({
        height: 'shrink',
        left: 'center',
        parent: screen,
        top: 'center',
        width: 'shrink',
    });

    editor.key('escape', () => {
        const value = editor.getContent();
        let json;
        try {
            json = json5.parse(value);
            parser.setConfigValue(key, json);
        }
        catch (e) {
            (<any>msg).error('Submitted text must be valid JSON5.', 1);
        }
        screen.remove(editor);
        screen.remove(msg);
        editor.free();
        msg.free();
        screen.emit('repaint');
    });

    editor.focus();
    screen.render();
}
