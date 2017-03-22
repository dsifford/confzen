import { screen as Screen } from 'blessed';

export const screen = Screen({
    autoPadding: true,
    dockBorders: true,
    smartCSR: true,
});

screen.title = 'ccli';

// Quit on Control-C.
screen.key(['C-c'], () => {
    return process.exit(0);
});

// Trigger finalize on escape, or q
screen.key(['escape', 'q'], () => screen.emit('finalize'));
