import { resolve } from 'node:path';

const context = resolve(process.cwd(), 'src');

const PLUGIN_NAME = 'Plugin';

class Plugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      PLUGIN_NAME,
      (normalModuleFactory) => {
        console.log(normalModuleFactory.hooks);

        normalModuleFactory.hooks.createModule.tap(
          PLUGIN_NAME,
          (createData, resolveData) => {
            console.log(createData, resolveData);

            // if (NormalModule.resource.endsWith('i.json')) {
            //   console.log(NormalModule);
            //   NormalModule.generator.filename = '[name][ext]';
            // }
          },
        );
      },
    );
  }
}

export default {
  mode: 'production',
  context,
  entry: {
    main: './testd/a.js',
    o: './testd/o.json',
    i: './testd/i.json',
  },
  output: {
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        type: 'asset/resource',
        test: /\\i\.json/,
      },
    ],
  },
  plugins: [new Plugin()],
};
