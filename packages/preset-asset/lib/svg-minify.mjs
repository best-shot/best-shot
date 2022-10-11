import { optimize } from 'svgo';
import config from 'svgo-config/lib/config.mjs';

export async function svgMinify(original, { ...options } = {}) {
  let result;

  if (options.multipass === undefined) {
    // eslint-disable-next-line no-param-reassign
    options.multipass = true;
  }

  if (options.plugins === undefined) {
    // eslint-disable-next-line no-param-reassign
    options.plugins = config.plugins;
  }

  try {
    result = await optimize(original.data.toString(), options);
  } catch (error) {
    original.errors.push(error);

    return original;
  }

  return {
    filename: original.filename,
    data: Buffer.from(result.data),
    warnings: [...original.warnings],
    errors: [...original.errors],
    info: {
      ...original.info,
      minimized: true,
      minimizedBy:
        original.info && original.info.minimizedBy
          ? ['svgo', ...original.info.minimizedBy]
          : ['svgo'],
    },
  };
}
