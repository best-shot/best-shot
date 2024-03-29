export class ConfigError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'ConfigError';
    this.detail = detail;
  }
}

let ajv;

export async function validate({ data, schema }) {
  if (!ajv) {
    const { default: Ajv } = await import('ajv');
    const { default: addFormats } = await import('ajv-formats');
    const { default: addKeywords } = await import('ajv-keywords');
    const { default: instanceofDef } = await import(
      'ajv-keywords/dist/definitions/instanceof.js'
    );

    ajv = new Ajv({
      strict: true,
      useDefaults: true,
    });

    addFormats(ajv, ['regex']);

    instanceofDef.CONSTRUCTORS.URL = URL;

    addKeywords(ajv, [
      'instanceof',
      'typeof',
      'transform',
      'uniqueItemProperties',
    ]);
  }

  const validator = ajv.compile(schema);

  const valid = validator(data);

  if (!valid) {
    throw new ConfigError('invalid configuration', validator.errors);
  }

  return data;
}
