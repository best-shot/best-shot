import { resolve } from 'node:path';

import extToRegexp from 'ext-to-regexp';

import { targetIsNode } from '../lib/utils.mjs';

export function apply({ cwd, config }) {
  const outputConfig = config.output ?? {};
  const experiments = config.experiments ?? {};
  const optimization = config.optimization ?? {};
  const { publicPath, path, module: useModule } = outputConfig;
  const { buildHttp } = experiments;
  const { minimize } = optimization;
  const { target, dependencies, externalsPresets, performance } = config;
  const contextInput = config.context;

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

    // webpack 5.110 exposes nodeModules as an externals preset, replacing
    // webpack-node-externals. Merge so the built-in target presets (node,
    // electron, …) that webpack applies itself are not disturbed.
    if (externalsPresets) {
      chain.externalsPresets(externalsPresets);
    }

    // webpack-chain stores `performance` outside the chain map, so `get`
    // cannot read it. Apply the project's defaults together with any user
    // options in one call. 5.110 added `hints: "stats"`, which reports the
    // size/hint diagnostics in stats instead of emitting build warnings.
    chain.performance({
      hints: 'stats',
      maxEntrypointSize: 1024 ** 2,
      maxAssetSize: 1024 ** 2,
      ...performance,
    });

    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.devtool(false);

    chain.optimization
      .minimize(minimize ?? mode === 'production')
      .removeEmptyChunks(true)
      .removeAvailableModules(true);

    // webpack's built-in minimizer handles CSS/HTML/JSON; JS options are
    // filled in by the terser built-in (terser-compatible options fed through
    // `minimizeOptions.javascript`). The "..." placeholder below keeps the
    // built-in minimizer active when a preset registers its own (e.g. image).
    chain.optimization.set('minimizeOptions', {
      json: true,
    });
    chain.get('x').addHooks((io) => {
      const minimizers = io.optimization?.minimizer;

      if (
        Array.isArray(minimizers) &&
        minimizers.length > 0 &&
        !minimizers.includes('...')
      ) {
        minimizers.push('...');
      }
    });

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

    chain.output
      .filename(
        isNode ? (useModule ? '[name].mjs' : '[name].cjs') : '[name].js',
      )
      .cssFilename('[name].css');

    if (!watch) {
      chain.output.clean(true);
    }

    if (publicPath !== undefined) {
      chain.output.publicPath(publicPath);
    }

    const { cachePath } = chain.get('x');

    // Enable webpack's built-in TypeScript parsing alongside babel-loader.
    // With `true` (rather than the `"auto"` default) the parser also handles
    // TS files that bypass a loader — e.g. dependencies in node_modules —
    // while babel still owns polyfills, evergreen downleveling and TSX.
    chain.experiments.set('typescript', true);

    chain.experiments.buildHttp({
      allowedUris: [],
      lockfileLocation: cachePath('locks/lock'),
      cacheLocation: cachePath('locks/cache'),
      upgrade: true,
      frozen: false,
      ...buildHttp,
    });

    if (useModule) {
      // ESM output is controlled by `output.module` (set via outputConfig
      // above); `experiments.outputModule` was removed in webpack 5.111.
      chain.output.chunkFormat('module').chunkLoading('import');
      // chain.output.library.type('module');
    } else if (isNode) {
      chain.output.library.type('commonjs-static');
    }

    chain.output.assetModuleFilename('[path][name][ext]');

    chain.output.merge(outputConfig);

    chain.output.path(
      resolve(
        cwd,
        path
          .replaceAll('[config-name]', () => name)
          .replaceAll('[mode]', () => mode),
      ),
    );

    // 5.109 deprecated `importMetaContext` in favour of the object form of
    // `importMeta`. Omitted fields stay enabled, so the object below keeps
    // every `import.meta` field (including webpackContext) on the web side;
    // `false` keeps them all off for node — matching the old semantics where
    // `importMeta: false` short-circuited webpackContext too.
    chain.module.parser.javascript({
      amd: false,
      requireJs: false,
      system: false,
      importMeta: isNode ? false : { webpackContext: true },
    });

    chain.module.parser.json({
      namedExports: true,
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
  externalsPresets: {
    type: 'object',
    default: {},
    additionalProperties: true,
  },
  performance: {
    type: 'object',
    default: {},
    additionalProperties: true,
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
  optimization: {
    type: 'object',
    default: {},
    properties: {
      minimize: {},
    },
  },
};
