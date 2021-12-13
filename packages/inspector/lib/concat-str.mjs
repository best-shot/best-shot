import { stringify } from 'javascript-stringify';
import sortKeys from 'sort-keys';

async function formatter(code) {
  try {
    const {
      default: { format },
      // eslint-disable-next-line import/no-extraneous-dependencies
    } = await import('prettier');
    return format(code, {
      parser: 'babel',
      singleQuote: true,
    });
  } catch {
    return code;
  }
}

const sortOptions = { deep: true };

function json2string(code) {
  const io = sortKeys(code, sortOptions);
  if (code.properties.vendors && code.properties.vendors.default) {
    io.properties.vendors.default = code.properties.vendors.default;
  }
  if (code.properties.entry && code.properties.entry.default) {
    io.properties.entry.default = code.properties.entry.default;
  }
  return JSON.stringify(io, null, '  ');
}

function js2string(code) {
  const io = sortKeys(code, sortOptions);
  if (code.config.vendors) {
    io.config.vendors = code.config.vendors;
  }
  if (code.config.entry) {
    io.config.entry = code.config.entry;
  }
  return stringify(io);
}

export function concatStr({ input, output, schema, stamp }) {
  return formatter(`
// Generate by \`best-shot\`
// repository: https://github.com/best-shot/best-shot
// website: https://www.npmjs.com/org/best-shot
// stamp: ${stamp}

/* eslint-disable */
export const schema = ${json2string(schema)}

export const input = ${js2string(input)}

export const config = ${output.toString()}
`);
}
