const { resolve } = require('path');
const { Router } = require('express');

const router = Router({ strict: true });

router.get(/\/\.best-shot\/(404\.svg|logo\.svg|logo\.png)/, (req, res) => {
  res.sendFile(resolve(__dirname, req.params[0]));
});

router.use((req, res) => {
  const [last] = req.url.split('/').slice(-1);
  if (last && !/\.html?$/.test(last) && /\.\w+$/.test(last)) {
    res.status(404).type('text').end();
  } else {
    res.status(404).type('html').sendFile(resolve(__dirname, '404.html'));
  }
});

module.exports = router;
