import gif from '@volue/wasm-codecs-gifsicle';
import jpg from '@volue/wasm-codecs-mozjpeg';
import png from '@volue/wasm-codecs-oxipng';
import { calculate } from 'buffer-image-size/lib/types/jpg.js';

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

export async function jpgMinify(original, { ...options } = {}) {
  let result;

  options.quality ??= 65;
  options.progressive ??= true;
  options.optimizeCoding ??= true;

  try {
    const { width, height } = calculate(original.data);

    result = await jpg(original.data, { width, height }, options);

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
          ? ['mozjpeg', ...original.info.minimizedBy]
          : ['mozjpeg'],
    },
  };
}

export async function pngMinify(original, { ...options } = {}) {
  let result;

  try {
    result = await png(original.data, options);

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
          ? ['oxipng', ...original.info.minimizedBy]
          : ['oxipng'],
    },
  };
}
