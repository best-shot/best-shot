'use strict';

if (module.hot) {
  module.hot.addStatusHandler((status) => {
    if (status === 'ready') {
      // eslint-disable-next-line import/no-unresolved
      require('electron').app.exit(0);
    } else if (status === 'abort' || status === 'fail') {
      // eslint-disable-next-line import/no-unresolved
      require('electron').app.exit(99);
    }
  });
}
