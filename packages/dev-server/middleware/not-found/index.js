const { resolve } = require('path');
const { Router } = require('express');
const { compile } = require('ejs');
const { readFileSync } = require('fs');

const router = Router({ strict: true });

router.get(
  '/.best-shot/:name(404.svg|logo.svg|logo.png)',
  ({ params: { name } }, res) => {
    res.sendFile(name, { root: __dirname });
  },
);

function isRaw({ method, url }) {
  const [last] = url.split('/').slice(-1);
  return (
    method !== 'GET' || (last && !/\.html?$/.test(last) && /\.\w+$/.test(last))
  );
}

router.use(({ method, url }, res, next) => {
  if (isRaw({ method, url })) {
    res.status(404).type('text').end();
  } else {
    next();
  }
});

module.exports = function notFound({ publicPath: path }) {
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
