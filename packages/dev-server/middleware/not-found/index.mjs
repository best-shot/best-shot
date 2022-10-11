import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { compile } from 'ejs';
import { Router } from 'express';

import { isRaw } from '../../lib/utils.mjs';

const router = Router({ strict: true });

const __dirname = dirname(fileURLToPath(import.meta.url));

router.use(({ method, url }, res, next) => {
  if (method !== 'GET' || isRaw(url)) {
    res.status(404).type('text').end();
  } else {
    next();
  }
});

export function notFound({ publicPath: path = '/' }) {
  const render = compile(
    readFileSync(resolve(__dirname, '404.html'), {
      encoding: 'utf8',
    }),
    {
      delimiter: '?',
      openDelimiter: '[',
      closeDelimiter: ']',
    },
  );

  router.use(({ originalUrl, url }, res) => {
    const URL = originalUrl
      ? originalUrl.endsWith('/')
        ? `${originalUrl}index.html`
        : originalUrl
      : url;

    const notRoot = path !== '/';

    const html = render({
      publicPath:
        notRoot && !URL.startsWith(`${path}index.html`) ? path : undefined,
    });

    res.status(404).type('html').send(html);
  });

  return router;
}
