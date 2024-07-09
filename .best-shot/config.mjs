import { join } from 'node:path';

export const config = {
  presets: ['style'],
  target: [
    // 'node20',
    'es2024',
  ],
  entry: {
    app: './app.vue',
  },
  output: {
    module: true,
    publicPath: '/',
  },
  terser: {
    compress: {
      drop_console: false,
    },
  },
  dataURI: true,
  chain(chain) {
    chain.context(join(process.cwd(), 'src'));

    chain.module
      .rule('vue')
      .test(/\.vue$/)
      .use('split')
      .loader('@best-shot/split-loader');
  },
};
