import { extname } from 'node:path';

import { compressJpeg, losslessCompressPng } from '@napi-rs/image';
import gif from '@volue/wasm-codecs-gifsicle';

/* eslint-disable no-param-reassign */

function detectType(original) {
  const { data } = original;

  if (
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47
  ) {
    return 'image/png';
  }

  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return 'image/jpeg';
  }

  return data.length >= 4 &&
    data[0] === 0x47 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x38
    ? 'image/gif'
    : undefined;
}

function resolveType(original) {
  return (
    detectType(original) ||
    (original.info?.sourceFilename
      ? original.info.sourceFilename.match(/^data:(image\/[\w+]+);/)?.[1] ||
        extname(original.info.sourceFilename).replace('.', 'image/')
      : undefined)
  );
}

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

function minimized(original, result) {
  const name = '@napi-rs/image';

  return {
    filename: original.filename,
    data: result,
    warnings: [...original.warnings],
    errors: [...original.errors],
    info: {
      ...original.info,
      minimized: true,
      minimizedBy: original.info?.minimizedBy
        ? [name, ...original.info.minimizedBy]
        : [name],
    },
  };
}

export async function baseMinify(original, { ...options } = {}) {
  try {
    const type = resolveType(original);

    switch (type) {
      case 'image/gif': {
        return gifMinify(original, options);
      }
      case 'image/jpeg': {
        const result = await compressJpeg(original.data, {
          quality: options.quality ?? 75,
          optimizeScans: options.optimizeScans ?? true,
        });

        return result.length < original.data.length
          ? minimized(original, result)
          : original;
      }
      case 'image/png': {
        const result = await losslessCompressPng(original.data, options);

        return result.length < original.data.length
          ? minimized(original, result)
          : original;
      }
      default: {
        return original;
      }
    }
  } catch (error) {
    original.errors.push(error);

    return original;
  }
}
