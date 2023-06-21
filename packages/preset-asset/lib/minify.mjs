import * as codecs from '@astropub/codecs';
import gif from '@volue/wasm-codecs-gifsicle';

/* eslint-disable no-param-reassign */

export async function gifMinify(original, { ...options } = {}) {
  let result;

  options.interlaced ??= true;

  try {
    result = await gif(original.data, options);

    if (result.length > original.data.length) {
      return original;
    }
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

export async function baseMinify(original, { ...options } = {}) {
  let result;

  try {
    const type = codecs.type(original.data);
    switch (type) {
      case 'image/jpeg': {
        options.quality ??= 75;
        options.progressive ??= true;
        options.optimize_coding ??= true;
        break;
      }
      case 'image/png': {
        options.quality ??= 75;
        options.interlace ??= true;
        break;
      }
      default: {
        break;
      }
    }
    const decoded = await codecs.decode(original.data);
    const encoded = await codecs.encode(decoded, type, options);

    result = Buffer.from(encoded.data);

    if (result.length > original.data.length) {
      return original;
    }
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
          ? ['@astropub/codecs', ...original.info.minimizedBy]
          : ['@astropub/codecs'],
    },
  };
}
