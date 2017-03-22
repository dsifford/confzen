import { arrayOfBooleanAndPrimitiveField } from './arrayOfBooleanAndPrimitiveField';
import { arrayOfEnumField } from './arrayOfEnumField';
import { arrayOfStringField } from './arrayOfStringField';
import { booleanField } from './booleanField';
import { enumField } from './enumField';
import { numberField } from './numberField';
import { objectOfPrimitiveField } from './objectOfPrimitive';
import { stringField } from './stringField';
import { textEditorInput } from './textEditorInputField';

export { textEditorInput } from './textEditorInputField';

export default {
    arrayOf: {
        booleanAndPrimitive: arrayOfBooleanAndPrimitiveField,
        enum: arrayOfEnumField,
        string: arrayOfStringField,
    },
    boolean: booleanField,
    enum: enumField,
    fallback: textEditorInput,
    number: numberField,
    object: objectOfPrimitiveField,
    string: stringField,
};
