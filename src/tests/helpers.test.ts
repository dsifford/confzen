import test from 'ava';
import * as helpers from '../runtime/helpers';

test('sortMixedArray', t => {
    const unsorted = [
        { foo: 'bar' },
        'foo',
        9,
        false,
        'bar',
        24,
        { baz: 'baz' },
        true,
    ];
    const expected = [
        true,
        false,
        9,
        24,
        'bar',
        'foo',
        { baz: 'baz' },
        { foo: 'bar' },
    ];
    const actual = [...unsorted].sort(helpers.sortMixedArray);
    t.deepEqual(actual, expected);
});

test('deepSortObject', t => {
    // tslint:disable:object-literal-sort-keys
    const unsorted = {
        foo: {
            xray: {
                tango: {
                    whisky: 25,
                    charlie: true,
                },
                alpha: [
                    'foo',
                    'bar',
                    'baz',
                ],
            },
            bravo: 'bravo',
        },
        charlie: {
            henry: {
                foxtrot: false,
            },
        },
        sam: 'sam',
    };
    // tslint:enable:object-literal-sort-keys
    const unsortedCopy = Object.assign({}, unsorted);
    const expected = {
        charlie: {
            henry: {
                foxtrot: false,
            },
        },
        foo: {
            bravo: 'bravo',
            xray: {
                alpha: [
                    'foo',
                    'bar',
                    'baz',
                ],
                tango: {
                    charlie: true,
                    whisky: 25,
                },
            },
        },
        sam: 'sam',
    };
    const actual = helpers.deepSortObject(unsorted);
    t.deepEqual(unsorted, unsortedCopy);
    t.deepEqual(actual, expected);
});

test('stringToPrimitive', t => {
    const strings = [
        'true',
        'false',
        '45',
        'foo',
        '12.345',
    ];
    const expected = [
        true,
        false,
        45,
        'foo',
        12.345,
    ];
    for (const [i, str] of strings.entries()) {
        t.is(helpers.stringToPrimitive(str), expected[i]);
    }
});
