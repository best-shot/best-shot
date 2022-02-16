import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import deepmerge from 'deepmerge';
import extToRegexp from 'ext-to-regexp';
import slash from 'slash';
import slashToRegexp from 'slash-to-regexp';

function mergeAll(...options) {
  return deepmerge.all(options, {
    arrayMerge: (destinationArray, sourceArray) => sourceArray,
  });
}

export function setHtml({ html = {}, inject = [] }) {
  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const context = chain.get('context');
    const minimize = chain.optimization.get('minimize');

    const page = Array.isArray(html) ? html : [html];

    const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');

    const defaultTemplate = slash(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../template.html'),
      ),
    );

    page.forEach(({ title = 'BEST-SHOT APP', ...options }, index) => {
      chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [
        mergeAll(
          { template: defaultTemplate },
          index > 0 ? page[0] : {},
          options,
          {
            cache: watch,
            minify: false,
            title,
            templateParameters: {
              title,
            },
          },
        ),
      ]);
    });

    if (minimize) {
      const { default: HtmlMinimizerPlugin } = await import(
        'html-minimizer-webpack-plugin'
      );

      chain.optimization.minimizer('html').use(HtmlMinimizerPlugin, [
        {
          test: extToRegexp({ extname: ['html', 'htm'] }),
          minimizerOptions: {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
        },
      ]);
    }

    if (inject.length > 0) {
      const {
        default: { default: HtmlWebpackInjectPlugin },
      } = await import('html-webpack-inject-plugin');

      chain
        .plugin('inject')
        .use(HtmlWebpackInjectPlugin, [{ externals: inject }]);
    }

    if (mode === 'production') {
      chain.output.crossOriginLoading('anonymous');

      const { SubresourceIntegrityPlugin } = await import(
        'webpack-subresource-integrity'
      );

      chain.plugin('subresource-integrity').use(SubresourceIntegrityPlugin);
    }

    chain.module
      .rule('micro-tpl')
      .test(extToRegexp({ extname: ['html', 'htm'] }))
      .use('micro-tpl-loader')
      .loader('micro-tpl-loader');

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../../node_modules'),
      ),
    );

    if (!watch && chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/micromustache/'));
    }
  };
}
