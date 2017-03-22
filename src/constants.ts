import { ConfigKind } from './runtime/getSchema';

type FilenameMap = { [key in ConfigKind]: string };
export const FILENAMES: FilenameMap = {
    babel: '.babelrc',
    eslint: '.eslintrc.json',
    tslint: 'tslint.json',
    typescript: 'tsconfig.json',
};

type IgnoredFieldsMap = { [key in ConfigKind]: string[] };
export const IGNORED_FIELDS: IgnoredFieldsMap = {
    babel: [],
    eslint: [],
    tslint: [
        'component-class-suffix',
        'component-selector-name',
        'component-selector-prefix',
        'component-selector-type',
        'directive-class-suffix',
        'directive-selector-name',
        'directive-selector-prefix',
        'directive-selector-type',
    ],
    typescript: [],
};
