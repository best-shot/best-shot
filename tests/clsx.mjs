import { clsx } from '@best-shot/sfc-split-plugin/wxs/clsx.wxs';
import test from 'ava';
import classnames from 'clsx';

function marco(t, args) {
  const original = classnames(...args);
  const implementation = clsx(...args);

  if (implementation === original) {
    t.pass();
  } else {
    t.snapshot(args, 'arguments');
    t.snapshot(implementation, 'implementation');
    t.snapshot(original, 'original');
  }
}

test('string arguments', marco, ['foo', 'bar', 'baz']);
test('empty call', marco, []);
test('numbers', marco, [1, 2, 0, 'foo']);
test('boolean arguments', marco, ['foo', true, 'bar', false, 'baz']);

test('falsy values', marco, [null, false, undefined, 0, '']);

test('object with boolean values', marco, [
  { foo: true, bar: false, baz: true },
]);
test('object with mixed values', marco, [
  {
    a: null,
    b: undefined,
    c: 0,
    d: 1,
    e: true,
    f: false,
    g: 'str',
    h: [],
    i: {},
  },
]);
test('object with number key', marco, [{ 123: true, 456: false }]);

test('array of strings', marco, [['foo', 'bar', 'baz']]);
test('array with mixed types', marco, [
  ['foo', 0, false, 'bar', null, undefined, 'baz', 1, [], {}],
]);
test('array with objects', marco, [
  ['foo', { bar: true, baz: false }, 'qux', { a: 1, b: 0 }],
]);

test('mixed top-level arguments', marco, [
  'foo',
  { bar: true, duck: false },
  ['baz', { qux: true }],
  null,
  0,
  undefined,
  false,
  'end',
  [],
  {},
]);

test('object values parsed by JSON.parse', marco, [
  {
    str_true: 'true',
    str_false: 'false',
    str_0: '0',
    str_1: '1',
    str_null: 'null',
    str_undefined: 'undefined',
    num_0: 0,
    num_1: 1,
    bool_true: true,
    bool_false: false,
    arr_empty: [],
    obj_empty: {},
  },
]);

test('duplicate classes', marco, [
  'foo',
  'bar',
  'foo',
  { foo: true, bar: true },
  ['foo', 'bar'],
]);

test('empty containers', marco, [{}, [], null, undefined, false, 0, '']);

test('nested falsy/empty values', marco, [
  ['a', [null, ['b', [{ c: false, d: '' }, [], {}]]]],
]);

test('non-zero numbers', marco, [1, -1, 0.5, ['foo', 1, -1], { a: 1, b: -1 }]);

test('conditional class application', marco, [
  {
    btn: true,
    'btn-primary': true,
    'btn-large': false,
    disabled: false,
    active: true,
  },
  ['container', { 'container-fluid': true, 'container-fixed': false }],
]);
