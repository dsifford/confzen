import { box } from 'blessed';
import Config from '../runtime/config';
import SchemaParser from '../runtime/schemaParser';
import { screen } from './';

export function confirmation(parser: SchemaParser, config?: Config): void {

    if (config === undefined) {
        return process.exit(0);
    }

    const prompt = box({
        border: 'line',
        content: 'Save config file and exit? (Y/n)',
        height: 'shrink',
        keys: true,
        label: 'Confirm',
        left: 'center',
        parent: screen,
        style: {
            border: {
                fg: 'blue',
            },
        },
        top: 'center',
        vi: true,
        width: 'shrink',
    });

    prompt.key(['y', 'enter'], () => {
        config.setFile(parser.config).then(() => {
            process.exit();
        });
    });

    prompt.key('n', () => {
        screen.remove(prompt);
        prompt.free();
        screen.render();
    });

    prompt.key(['q', 'escape'], () => process.exit(0));

    prompt.focus();
    screen.render();
}
