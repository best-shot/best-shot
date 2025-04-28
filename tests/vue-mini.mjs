import { readFileSync } from 'node:fs';

import { serializeTemplate } from '@padcom/vue-ast-serializer';
import test from 'ava';
import { createPatch } from 'diff';
import { stringify } from 'javascript-stringify';
import { format } from 'prettier';

import { parse } from '@vue/compiler-sfc';

import { pretty } from '../tools/sfc-split/parse/pretty.cjs';
import { traverse } from '../tools/sfc-split/parse/traverse.mjs';

import * as plugin from './helper/prettier.mjs';

function serialize(ast) {
  return `${pretty(serializeTemplate({ ast }))}\n`;
}

async function jsStringify(ast) {
  const io = await format(`export default ${stringify(ast, null, 2)}`, {
    parser: 'babel',
    trailingComma: 'all',
    plugins: [plugin],
  });

  return io.replace(/^export\sdefault\s/, '');
}

const vueString = readFileSync(
  new URL('./fixtures/sample.vue', import.meta.url),
  'utf8',
);

function compare(name, oldOne, newOne) {
  return createPatch(name, oldOne, newOne, 'original', 'traversed', {
    ignoreWhitespace: true,
    stripTrailingCr: true,
  });
}

test('traverse', async (t) => {
  const { ast } = parse(vueString).descriptor.template;

  const clone = structuredClone(ast);

  traverse(clone);

const y = compare(
      'ast', //
      await jsStringify(ast),
      await jsStringify(clone),
    )

  t.snapshot(
   y,
  );

  const clone2 = structuredClone(clone);

  traverse(clone2, {
    TEXT(node) {
      node.content = node.content.toUpperCase();
    },
  });

  t.snapshot(
    compare(
      'ast', //
      await jsStringify(clone),
      await jsStringify(clone2),
    ),
  );

  t.snapshot(
    compare(
      'tpl', //
      serialize(ast),
      serialize(clone2),
    ),
  );
});
