import { resolve } from 'node:path';

import extToRegexp from 'ext-to-regexp';

import { targetIsNode } from '../lib/utils.mjs';

export function apply({
  cwd,
  config: {
    output: { publicPath, path, module: useModule } = {},
    output = {},
    target,
    context: contextInput,
    dependencies,
    experiments: { buildHttp } = {},
  },
}) {
  return (chain) => {
    if (contextInput) {
      chain.context(resolve(cwd, contextInput));
    }

    if (target !== undefined) {
      chain.target(target);
    }

    if (dependencies) {
      chain.dependencies(dependencies);
    }

    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.devtool(false);

    chain.optimization
      .removeEmptyChunks(true)
      .removeAvailableModules(true)
      .minimize(mode === 'production');

    if (watch) {
      chain.watchOptions.ignored(/node_modules/);
      chain.output.pathinfo(false);
      chain.optimization.removeAvailableModules(false).innerGraph(false);
    }

    chain.optimization
      .providedExports(true)
      .usedExports(true)
      .concatenateModules(true);

    chain.module.strictExportPresence(!watch);

    const name = chain.get('name') || '';

    const isNode = targetIsNode(target);

    chain.output.filename(
      isNode ? (useModule ? '[name].mjs' : '[name].cjs') : '[name].js',
    );

    if (!watch) {
      chain.output.clean(true);
    }

    if (publicPath !== undefined) {
      chain.output.publicPath(publicPath);
    }

    const { cachePath } = chain.get('x');

    chain.experiments.buildHttp({
      allowedUris: [],
      lockfileLocation: cachePath('locks/lock'),
      cacheLocation: cachePath('locks/cache'),
      upgrade: true,
      frozen: false,
      ...buildHttp,
    });

    if (useModule) {
      chain.experiments.outputModule(true);
      chain.output.chunkFormat('module').chunkLoading('import');
      // chain.output.library.type('module');
    } else if (isNode) {
      chain.output.library.type('commonjs-static');
    }

    chain.output.assetModuleFilename('[path][name][ext]');

    chain.output.merge(output);

    chain.output.path(
      resolve(
        cwd,
        path.replaceAll('[config-name]', name).replaceAll('[mode]', mode),
      ),
    );

    chain.module.parser.javascript({
      amd: false,
      requireJs: false,
      system: false,
      importMeta: !isNode,
      importMetaContext: true,
    });

    chain.module
      .rule('esm')
      .test(extToRegexp({ extname: ['js', 'mjs'] }))
      .resolve.fullySpecified(false);
  };
}

export const name = 'basic';

export const schema = {
  context: {
    type: 'string',
  },
  output: {
    type: 'object',
    default: {},
    properties: {
      path: {
        default: 'dist',
        description:
          'It can be a relative path. Additional placeholder: [mode][config-name]',
        minLength: 1,
        type: 'string',
      },
    },
  },
};
