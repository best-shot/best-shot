const { resolve } = require('path');

module.exports = [
  {
    output: {
      path: resolve('temp/1'),
    },
    watchOptions: {
      poll: 1000,
    },
    stats: 'minimal',
  },
  {
    output: {
      path: resolve('temp/5'),
    },
    watchOptions: {
      poll: 2000,
    },
    stats: 'normal',
  },
];
