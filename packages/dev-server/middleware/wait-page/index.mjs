import { readFileSync } from 'fs';

import webpackDevServerWaitpage from 'webpack-dev-server-waitpage';

import { isRaw } from '../../lib/utils.mjs';

export function apply(compiler) {
  webpackDevServerWaitpage.plugin().apply(compiler);
}

export function middleware(server) {
  const template = readFileSync(
    new URL('template.html', import.meta.url),
    'utf8',
  );

  return webpackDevServerWaitpage(server, {
    template,
    ignore: (req) => isRaw(req.url),
  });
}
