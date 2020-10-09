const { resolve } = require('path');
const { Router } = require('express');
const { compile } = require('micromustache');
const { readFileSync } = require('fs');

const router = Router({ strict: true });

router.get(
  '/.best-shot/:name(404.svg|logo.svg|logo.png)',
  ({ params: { name } }, res) => {
    res.sendFile(name, { root: __dirname });
  },
);

router.use(({ method, url }, res, next) => {
  const [last] = url.split('/').slice(-1);
  if (
    method !== 'GET' ||
    (last && !/\.html?$/.test(last) && /\.\w+$/.test(last))
  ) {
    res.status(404).type('text').end();
  } else {
    next();
  }
});

module.exports = function notFound({ publicPath: path }) {
  router.use(({ originalUrl, url }, res) => {
    const { render } = compile(
      readFileSync(resolve(__dirname, '404.html'), {
        encoding: 'utf-8',
      }),
    );

    const notRoot = path !== '.' && path !== '/';

    const URL = originalUrl
      ? originalUrl.endsWith('/')
        ? `${originalUrl}index.html`
        : originalUrl
      : url;

    const html = render({
      publicPath:
        notRoot && !URL.startsWith(`${path}index.html`) ? path : undefined,
    });

    res.status(404).type('html').send(html);
  });

  return router;
};
