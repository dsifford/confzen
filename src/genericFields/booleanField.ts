import SchemaParser from '../runtime/schemaParser';
import { screen } from '../widgets/';

export function booleanField(parser: SchemaParser, key: string): void {
    const currentValue: boolean | undefined = parser.getConfigValue(key);

    switch (currentValue) {
        case true:
            parser.setConfigValue(key, false);
            break;
        case false:
            parser.setConfigValue(key);
            break;
        default:
            parser.setConfigValue(key, true);
    }

    screen.emit('repaint');
}
