import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import slash from 'slash';
import slashToRegexp from 'slash-to-regexp';

function css([string]) {
  return string.trim().replaceAll(/\n\s+/g, '');
}

const darkTag = {
  tagName: 'style',
  prepend: false,
  innerHTML: css`
    @media (prefers-color-scheme: dark) {
      html {
        background-color: black;
      }
    }
  `,
};

const wdsTag = {
  tagName: 'style',
  prepend: false,
  innerHTML: css`
    wds-progress {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
};

export function setHtml({ html = {} }) {
  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const serve = chain.devServer.entries() !== undefined;

    const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');

    const defaultTemplate = slash(
      fileURLToPath(import.meta.resolve('./template.html')),
    );

    const isModule = chain.output.get('module');

    const page = (Array.isArray(html) ? html : [html]).map(
      ({
        title = 'BEST-SHOT APP',
        template = defaultTemplate,
        tags = [],
        darkMode = true,
        ...options
      }) => ({
        cache: watch,
        minify: false,
        xhtml: true,
        title,
        template,
        tags: [
          darkMode ? darkTag : undefined,
          serve ? wdsTag : undefined,
          ...tags,
        ].filter(Boolean),
        ...(isModule ? { scriptLoading: 'module' } : undefined),
        templateParameters: {
          title,
          ...options.templateParameters,
        },
        ...options,
      }),
    );

    page.forEach((options, index) => {
      chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [options]);
    });

    if (page.some(({ tags = [] }) => tags.length > 0)) {
      const { HtmlAddAssetWebpackPlugin } = await import(
        'html-add-asset-webpack-plugin'
      );

      chain.plugin('html-add-asset').use(HtmlAddAssetWebpackPlugin);
    }

    const minimize = chain.optimization.get('minimize');

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

      const { SubresourceIntegrityPlugin } = createRequire(import.meta.url)(
        'webpack-subresource-integrity',
      );

      chain.plugin('subresource-integrity').use(SubresourceIntegrityPlugin);
    }

    chain.module
      .rule('micro-tpl')
      .test(extToRegexp({ extname: ['html', 'htm'] }))
      .use('micro-tpl-loader')
      .loader(fileURLToPath(import.meta.resolve('micro-tpl-loader')));

    if (!watch && chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/micromustache/'));
    }
  };
}
