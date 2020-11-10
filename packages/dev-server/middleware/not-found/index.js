const { resolve } = require('path');
const { Router } = require('express');
const { compile } = require('ejs');
const { readFileSync } = require('fs');

const { isRaw } = require('../../lib/utils');

const router = Router({ strict: true });

router.get(
  '/.best-shot/:name(404.svg|logo.svg|logo.png)',
  ({ params: { name } }, res) => {
    res.sendFile(name, { root: __dirname });
  },
);

router.use(({ method, url }, res, next) => {
  if (method !== 'GET' || isRaw(url)) {
    res.status(404).type('text').end();
  } else {
    next();
  }
});

module.exports = function notFound({ publicPath: path = '/' }) {
  const render = compile(
    readFileSync(resolve(__dirname, '404.html'), {
      encoding: 'utf-8',
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
};
