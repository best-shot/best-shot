/* eslint import/no-unresolved: [2, { ignore: ['electron'] }] */
if (import.meta.webpackHot) {
  // eslint-disable-next-line no-inner-declarations
  function exit(exitCode = 0) {
    import('electron')
      .then(({ app }) => {
        app.exit(exitCode);
      })
      .catch(console.error);
  }

  import.meta.webpackHot.addStatusHandler((status) => {
    if (status === 'ready') {
      exit();
    } else if (status === 'abort' || status === 'fail') {
      exit(99);
    }
  });
}
