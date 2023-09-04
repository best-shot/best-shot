import { extname } from 'node:path';

import * as codecs from '@astropub/codecs';
import gif from '@volue/wasm-codecs-gifsicle';

/* eslint-disable no-param-reassign */

async function gifMinify(original, { ...options } = {}) {
  let result;

  options.interlaced ??= true;

  try {
    result = await gif(original.data, options);

    if (result.length >= original.data.length) {
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
      minimizedBy: original.info?.minimizedBy
        ? ['gifsicle', ...original.info.minimizedBy]
        : ['gifsicle'],
    },
  };
}

export async function baseMinify(original, { ...options } = {}) {
  let result;

  try {
    const type =
      codecs.type(original.data) ||
      (original.info?.sourceFilename
        ? original.info.sourceFilename.match(/^data:(image\/[\w+]+);/)?.[1] ||
          extname(original.info.sourceFilename).replace('.', 'image/')
        : undefined);
    switch (type) {
      case 'image/gif': {
        return gifMinify(original, options);
      }
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
      case 'image/svg+xml':
      case '':
      case undefined: {
        return original;
      }
      default: {
        return original;
      }
    }
    const decoded = await codecs.decode(original.data);
    const encoded = await codecs.encode(decoded, type, options);

    if (encoded === null) {
      return original;
    }

    result = Buffer.from(encoded.data);

    if (result.length >= original.data.length) {
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
      minimizedBy: original.info?.minimizedBy
        ? ['@astropub/codecs', ...original.info.minimizedBy]
        : ['@astropub/codecs'],
    },
  };
}
