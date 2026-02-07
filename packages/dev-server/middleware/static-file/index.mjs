import { Router } from 'express';

const router = Router({ strict: true });

export function staticFile() {
  router.get(
    '/.best-shot/:name(404.svg|logo.svg|logo.png|style.css)',
    ({ params: { name } }, res) => {
      res.sendFile(name, { root: import.meta.dirname });
    },
  );

  return router;
}
