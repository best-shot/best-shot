/* eslint import/no-unresolved: [2, { ignore: ['electron'] }] */
if (import.meta.webpackHot) {
  import.meta.webpackHot.addStatusHandler((status) => {
    if (status === 'ready') {
      import('electron')
        .then(({ app }) => {
          app.exit(0);
        })
        .catch(console.error);
    } else if (status === 'abort' || status === 'fail') {
      import('electron')
        .then(({ app }) => {
          app.exit(99);
        })
        .catch(console.error);
    }
  });
}
