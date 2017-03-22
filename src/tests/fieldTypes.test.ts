// tslint:disable:object-literal-sort-keys
import test from 'ava';
import * as ft from '../runtime/fieldTypes';

test('isStringOrStringArray', t => {
    const shouldPass = [
        {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        {
            type: ['string', 'array'],
            items: {
                type: 'string',
            },
        },
    ];

    const shouldFail = [
        {
            items: {
                type: 'string',
            },
        },
        {
            type: 'number',
        },
        {
            type: ['string', 'array', 'boolean'],
            items: {
                type: 'string',
            },
        },
        {
            type: ['string', 'boolean'],
            items: {
                type: 'string',
            },
        },
        {
            type: ['string', 'array'],
            items: {
                type: 'number',
            },
        },
    ];

    for (const obj of shouldPass) {
        t.true(ft.isStringOrStringArray(obj));
    }

    for (const obj of shouldFail) {
        t.false(ft.isStringOrStringArray(obj));
    }
});

test('isArrayOfPrimitiveEnum', t => {

    const shouldPass = [
        {
            type: ['array'],
            items: {
                enum: [
                    'string',
                    'boolean',
                    'number',
                ],
            },
        },
        {
            type: 'array',
            items: {
                enum: [
                    'string',
                    'number',
                ],
            },
        },
    ];

    const shouldFail = [
        {
            type: ['array'],
        },
        {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        {
            type: 'number',
            items: {
                enum: [
                    'string',
                    false,
                    35,
                ],
            },
        },
        {
            type: 'array',
            items: {
                enum: [
                    'string',
                    true,
                    34,
                    { foo: 'bar' },
                ],
            },
        },
    ];

    for (const obj of shouldPass) {
        t.true(ft.isArrayOfPrimitiveEnum(obj));
    }

    for (const obj of shouldFail) {
        t.false(ft.isArrayOfPrimitiveEnum(obj));
    }

});

test('isArrayOfBooleanAndPrimitive', t => {

    const shouldPass = [
        {
            type: 'array',
            items: {
                type: ['boolean', 'number', 'string'],
            },
        },
        {
            type: 'array',
            items: {
                type: ['boolean', 'string'],
            },
        },
        {
            type: 'array',
            items: {
                type: ['boolean', 'number'],
            },
        },
    ];

    const shouldFail = [
        {
            type: 'array',
        },
        {
            items: {
                type: ['boolean', 'number'],
            },
        },
        {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        {
            type: 'array',
            items: {
                type: ['boolean', 'number', 'object'],
            },
        },
    ];

    for (const obj of shouldPass) {
        t.true(ft.isArrayOfBooleanAndPrimitive(obj));
    }

    for (const obj of shouldFail) {
        t.false(ft.isArrayOfBooleanAndPrimitive(obj));
    }

});

test('isTerminalObject', t => {
    const shouldPass = [
        {
            foo: 'foo',
            bar: 35,
            baz: true,
        },
        {
            foo: 'foo',
            additionalProperties: {
                bar: 34,
            },
        },
    ];

    const shouldFail = [
        {
            foo: {
                bar: 'bar',
            },
            additionalProperties: {
                foo: 'foo',
            },
        },
    ];

    for (const obj of shouldPass) {
        t.true(ft.isTerminalObject(obj));
    }

    for (const obj of shouldFail) {
        t.false(ft.isTerminalObject(obj));
    }
});
