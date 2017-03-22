import { list } from 'blessed';
import { ConfigKind } from '../runtime/getSchema';
import { screen } from './';

const items: ConfigKind[] = ['typescript', 'tslint', 'eslint', 'babel'];

export const configTypePicker = list({
    border: 'line',
    height: 'half',
    items,
    keys: true,
    label: 'Select configuration file type',
    left: 'center',
    parent: screen,
    style: {
        selected: {
            bg: 'yellow',
            bold: true,
            fg: 'black',
        },
    },
    top: 'center',
    vi: true,
    width: 'shrink',
});

configTypePicker.once('select', item => screen.emit('configTypeSelected', item.getText()));
configTypePicker.focus();
