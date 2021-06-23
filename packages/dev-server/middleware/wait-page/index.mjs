import webpackDevServerWaitpage from 'webpack-dev-server-waitpage';

import { isRaw } from '../../lib/utils.mjs';

export function apply(compiler) {
  webpackDevServerWaitpage.plugin().apply(compiler);
}

export function middleware(server) {
  return webpackDevServerWaitpage(server, {
    title: 'Bundling...',

    ignore: (req) => isRaw(req.url),
  });
}
