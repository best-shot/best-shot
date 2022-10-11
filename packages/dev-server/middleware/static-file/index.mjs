import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Router } from 'express';

const router = Router({ strict: true });

export function staticFile() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  router.get(
    '/.best-shot/:name(404.svg|logo.svg|logo.png|style.css)',
    ({ params: { name } }, res) => {
      res.sendFile(name, { root: __dirname });
    },
  );

  return router;
}
