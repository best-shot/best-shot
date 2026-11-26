import { createRequire } from 'node:module';

function css([input]) {
  return input;
}

// Older dev servers rendered a <wds-progress> element; webpack-dev-server 6
// hosts its rebuild indicator in a shadow root on this element instead. Keep
// both translucent and click-through so the badge never blocks the page.
const DEV_SERVER_PROGRESS_STYLE = css`
  wds-progress {
    opacity: 0.5;
    pointer-events: none;
  }
  #webpack-dev-middleware-building-indicator {
    opacity: 0.5;
  }
`;

function injectStyle(html, style) {
  const tag = `<style>${style}</style>`;
  const closing = /<\/head>|<\/body>/i.exec(html)?.[0];
  return closing
    ? html.replace(closing, () => `${tag}\n${closing}`)
    : `${tag}\n${html}`;
}

class HtmlPagePlugin {
  constructor({ devServerProgress = false } = {}) {
    this.devServerProgress = devServerProgress;
  }

  apply(compiler) {
    // Use the compiler's own webpack instance: pnpm may install multiple
    // webpack copies, and hooks are instance-scoped WeakMaps.
    const { HtmlModulesPlugin } = compiler.webpack.html;

    compiler.hooks.compilation.tap('HtmlPagePlugin', (compilation) => {
      const hooks = HtmlModulesPlugin.getCompilationHooks(compilation);

      hooks.transformHtml.tapPromise('HtmlPagePlugin', async (html) =>
        this.devServerProgress
          ? injectStyle(html, DEV_SERVER_PROGRESS_STYLE)
          : html,
      );
    });
  }
}

export async function setHtml(chain) {
  const mode = chain.get('mode');

  // Native HTML is stable since webpack 5.109. `true` also disables the
  // fallback to a user loader when both could handle .html resources.
  chain.experiments.set('html', true);
  // html-webpack-plugin never emitted modulepreload hints or its polyfill.
  chain.output.set('resourceHints', false);
  // `[name]` resolves to the basename of the HTML source file.
  chain.output.set('htmlFilename', '[name].html');

  // Dev server renders a rebuild progress badge over the page. Inject its
  // styling into every HTML page so it stays translucent and click-through.
  const isServed = chain.devServer.entries() !== undefined;
  chain
    .plugin('html-pages')
    .use(HtmlPagePlugin, [{ devServerProgress: isServed }]);

  if (mode !== 'production') return;

  // webpack's built-in minimizer handles HTML via `htmlMinify`; configure it
  // through minimizeOptions instead of registering a separate minimizer.
  chain.optimization.set('minimizeOptions', {
    ...chain.optimization.get('minimizeOptions'),
    html: {
      collapseWhitespace: true,
      comments: false,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
    },
  });

  chain.output.crossOriginLoading('anonymous');
  // Native HTML integrity only covers static tags. The plugin adds runtime
  // SRI hashes for chunks loaded on demand via dynamic import().
  const require = createRequire(import.meta.url);
  const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
  chain.plugin('subresource-integrity').use(SubresourceIntegrityPlugin);

  const currentHtml = chain.output.get('html');
  chain.output.set('html', {
    ...(typeof currentHtml === 'object' && currentHtml),
    integrity: true,
  });
}
