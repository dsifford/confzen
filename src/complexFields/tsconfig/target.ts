import { list } from 'blessed';
import SchemaParser from '../../runtime/schemaParser';
import { screen } from '../../widgets/';

export function target(parser: SchemaParser, key: string): void {
    const currentIndex = parser.index;
    const items = currentIndex[key].anyOf[0].enum;
    const currentValue = parser.getConfigValue(key);

    const fieldList = list({
        border: 'line',
        height: 'half',
        items: [...items ],
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
        const selection = value.getText();
        parser.setConfigValue(key, selection !== currentValue ? selection : undefined);
        screen.remove(fieldList);
        fieldList.free();
        screen.emit('repaint');
    });

    fieldList.focus();
    screen.render();
}
