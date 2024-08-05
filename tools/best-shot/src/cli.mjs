/* eslint-disable import/no-extraneous-dependencies */
const { create } = await import(
  /* webpackIgnore: true */ '@best-shot/cli/bin/create.mjs'
).catch(() => import(/* webpackIgnore: true */ './create.mjs'));

/* eslint-enable import/no-extraneous-dependencies */

create();
