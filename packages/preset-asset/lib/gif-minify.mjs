import encode from '@wasm-codecs/gifsicle';

export async function gifMinify(original, options) {
  let result;

  try {
    result = await encode(original.data, options);
  } catch (error) {
    original.errors.push(error);
    return original;
  }

  return {
    filename: original.filename,
    data: result,
    warnings: [...original.warnings],
    errors: [...original.errors],
    info: {
      ...original.info,
      minimized: true,
      minimizedBy:
        original.info && original.info.minimizedBy
          ? ['gifsicle', ...original.info.minimizedBy]
          : ['gifsicle'],
    },
  };
}