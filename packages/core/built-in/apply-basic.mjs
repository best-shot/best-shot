import { resolve } from 'node:path';

import extToRegexp from 'ext-to-regexp';
import webpack from 'webpack';

import { targetIsNode } from '../lib/utils.mjs';

const { SourceMapDevToolPlugin } = webpack;

export function apply({ cwd, config }) {
  const outputConfig = config.output ?? {};
  const experiments = config.experiments ?? {};
  const optimization = config.optimization ?? {};
  const { publicPath, path, module: useModule } = outputConfig;
  const { buildHttp } = experiments;
  const { minimize } = optimization;
  const { target, dependencies, externalsPresets, performance } = config;
  const {
    strictModeViolations = 'warn',
    javascript: { fetchPriority, ...javascriptParser } = {},
    css: cssParser = {},
  } = config.parser ?? {};
  const { ignoreList, extractSourceMap = false } = config.devtool ?? {};
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

    if (ignoreList && Array.isArray(ignoreList) && ignoreList.length > 0) {
      // `ignoreList` is a SourceMapDevToolPlugin option; the top-level
      // `devtool` string cannot carry it. Replace the auto-created plugin with
      // an equivalent explicit one at toConfig time, after every preset has
      // decided the final devtool value. This mirrors webpack's own expansion
      // of `devtool: "source-map"` (WebpackOptionsApply) with ignoreList added.
      chain.get('x').addHooks((io) => {
        if (io.devtool !== 'source-map') return;

        const { output } = io;

        // eslint-disable-next-line no-param-reassign
        io.devtool = false;
        io.plugins.push(
          new SourceMapDevToolPlugin({
            // eslint-disable-next-line prefer-regex-literals
            test: new RegExp(String.raw`\.((c|m)?js|css)($|\?)`, 'i'),
            // webpack defaults output.sourceMapFilename during compiler setup;
            // at toConfig time it is still undefined, so supply the same
            // default the built-in devtool expansion would use.
            filename: output.sourceMapFilename ?? '[file].map[query]',
            moduleFilenameTemplate: output.devtoolModuleFilenameTemplate,
            fallbackModuleFilenameTemplate:
              output.devtoolFallbackModuleFilenameTemplate,
            module: true,
            columns: true,
            noSources: false,
            namespace: output.devtoolNamespace,
            ignoreList,
          }),
        );
      });
    }

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
      // 5.109: report constructs that break at runtime in strict mode when
      // emitted as ESM. webpack already defaults to "warn"; expose it as a
      // configurable option so projects can escalate or disable it.
      strictModeViolations,
      // 5.109 fine-grained resource hints: per-URL defaults (urlHints),
      // priority of dynamically imported chunks (fetchPriority) and preloading
      // of the CSS belonging to a dynamic chunk (dynamicImportCssPreload).
      ...javascriptParser,
      // `fetchPriority` is best-shot's name for webpack's
      // `dynamicImportFetchPriority` (the global priority for import() chunks).
      ...(fetchPriority !== undefined && {
        dynamicImportFetchPriority: fetchPriority,
      }),
    });

    // 5.109: preload the primary font of each @font-face reachable from an
    // HTML entry's initial CSS. Off by default; opt in via parser.css.
    if (Object.keys(cssParser).length > 0) {
      chain.module.parser.set('css', cssParser);
    }

    chain.module.parser.json({
      namedExports: true,
    });

    const esmRule = chain.module
      .rule('esm')
      .test(extToRegexp({ extname: ['js', 'mjs'] }));

    esmRule.resolve.fullySpecified(false);

    // 5.102: load the source map referenced by a `sourceMappingURL` comment
    // so dependencies that ship inline comments get proper stack traces.
    if (extractSourceMap) {
      esmRule.set('extractSourceMap', true);
    }
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
  devtool: {
    type: 'object',
    default: {},
    additionalProperties: false,
    properties: {
      // SourceMapDevToolPlugin ignoreList: RegExp / string / glob rules that
      // mark matching sources as ignored in DevTools (e.g. /node_modules/).
      ignoreList: {
        anyOf: [
          { instanceof: 'RegExp' },
          { type: 'string', minLength: 1 },
          { type: 'array', minItems: 1 },
        ],
      },
      extractSourceMap: { type: 'boolean', default: false },
    },
  },
  parser: {
    type: 'object',
    default: {},
    additionalProperties: false,
    properties: {
      strictModeViolations: {
        enum: ['error', 'warn', false],
        default: 'warn',
      },
      javascript: {
        type: 'object',
        default: {},
        additionalProperties: true,
        properties: {
          // Array of default-hint rules; each rule supports preload/prefetch/
          // as/type/media/fetchPriority plus test/include/exclude matchers.
          urlHints: { type: 'array' },
          fetchPriority: { enum: ['low', 'high', 'auto', false] },
          dynamicImportCssPreload: {
            anyOf: [{ type: 'boolean' }, { type: 'number' }],
          },
        },
      },
      css: {
        type: 'object',
        default: {},
        additionalProperties: true,
        properties: {
          fontPreload: { type: 'boolean' },
          urlHints: { type: 'array' },
        },
      },
    },
  },
};
