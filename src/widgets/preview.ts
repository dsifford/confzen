import { box } from 'blessed';
import { screen } from './';

export const preview = box({
    alwaysScroll: true,
    border: 'line',
    height: '100%',
    keys: true,
    mouse: true,
    right: 0,
    scrollable: true,
    style: {
        focus: {
            border: {
                fg: 'blue',
            },
        },
    },
    tags: true,
    top: 0,
    vi: true,
    width: 'half',
});

preview.key('tab', () => screen.emit('focus-pane', 'list'));
