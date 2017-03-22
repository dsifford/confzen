import { list } from 'blessed';
import { stringToPrimitive } from '../runtime/helpers';
import { sortMixedArray } from '../runtime/helpers';
import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function enumField(parser: SchemaParser, key: string): void {
    const currentIndex = parser.index;
    const currentValue = parser.getConfigValue(key);

    const fieldList = list({
        border: 'line',
        height: 'half',
        items: [...currentIndex[key].enum].sort(sortMixedArray).map(i => i.toString()),
        keys: true,
        label: key,
        left: 'center',
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
        width: 'half',
    });

    fieldList.once('select', value => {
        const selection = stringToPrimitive(value.getText());
        parser.setConfigValue(key, selection !== currentValue ? selection : undefined);
        screen.remove(fieldList);
        fieldList.free();
        screen.emit('repaint');
    });

    fieldList.focus();
    screen.render();
}
