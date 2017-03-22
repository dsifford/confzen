import { box, textbox } from 'blessed';
import SchemaParser from '../../runtime/schemaParser';
import { screen } from '../../widgets/';

type BanType = Array<boolean|string[]>;

export function ban(parser: SchemaParser, key: string): void {
    let payload: BanType = [];

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

    const globalInput = textbox({
        border: 'line',
        height: 'shrink',
        label: 'global',
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

    const methodInput = textbox({
        border: 'line',
        height: 'shrink',
        label: 'method',
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

    globalInput.on('submit', (value: string) => {
        if (value) {
            methodInput.readInput();
            return;
        }
        parser.setConfigValue(key, payload.length > 0 ? [true, ...payload] : undefined);
        screen.remove(preview);
        screen.remove(globalInput);
        screen.remove(methodInput);
        preview.free();
        globalInput.free();
        methodInput.free();
        screen.emit('repaint');
    });

    methodInput.on('submit', (value: string) => {
        const globalValue = globalInput.getText();
        if (value) {
            payload = [...payload, [ globalValue, value ]];
        }
        else {
            payload = [...payload, [globalValue]];
        }
        preview.setContent(JSON.stringify(payload, null, 4));
        methodInput.clearValue();
        globalInput.clearValue();
        globalInput.readInput();
        screen.render();
    });

    globalInput.readInput();
    screen.render();
}
