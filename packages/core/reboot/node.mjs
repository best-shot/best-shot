/* eslint-disable unicorn/no-process-exit, n/no-process-exit */

/* eslint import/no-unresolved: [2, { ignore: ['electron'] }] */

if (import.meta.webpackHot) {
  import.meta.webpackHot.addStatusHandler((status) => {
    if (status === 'ready') {
      process.exit(0);
    } else if (status === 'abort' || status === 'fail') {
      process.exit(99);
    }
  });
}
