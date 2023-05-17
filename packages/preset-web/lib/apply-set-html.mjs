import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import slash from 'slash';
import slashToRegexp from 'slash-to-regexp';

export function setHtml({ html = {} }) {
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
        fileURLToPath(new URL('template.html', import.meta.url)),
      ),
    );

    page.forEach(
      (
        { title = 'BEST-SHOT APP', template = defaultTemplate, ...options },
        index,
      ) => {
        chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [
          {
            ...options,
            cache: watch,
            minify: false,
            title,
            template,
            templateParameters: {
              title,
              ...options.templateParameters,
            },
          },
        ]);
      },
    );

    if (page.some(({ tags = [] }) => tags.length > 0)) {
      const { HtmlAddAssetWebpackPlugin } = await import(
        'html-add-asset-webpack-plugin'
      );

      chain.plugin('html-add-asset').use(HtmlAddAssetWebpackPlugin);
    }

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

    if (mode === 'production') {
      chain.output.crossOriginLoading('anonymous');

      const { SubresourceIntegrityPlugin } = await import(
        'webpack-subresource-integrity'
      );

      chain.plugin('subresource-integrity').use(SubresourceIntegrityPlugin);
    }

    chain.module
      .rule('micro-tpl')
      .after('esm')
      .test(extToRegexp({ extname: ['html', 'htm'] }))
      .use('micro-tpl-loader')
      .loader('micro-tpl-loader');

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        fileURLToPath(new URL('../node_modules', import.meta.url)),
      ),
    );

    if (!watch && chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/micromustache/'));
    }
  };
}
