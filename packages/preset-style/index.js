const { relative, resolve } = require('path');
const applyFont = require('./apply-font');
const applyImage = require('./apply-image');
const applyScssLess = require('./apply-scss-less');
const applyStylesheet = require('./apply-stylesheet');

function currentPath(src = '') {
  return resolve(process.cwd(), src);
}

const childNodeModules = relative(
  currentPath(),
  resolve(__dirname, './node_modules')
);

exports.apply = function apply(...args) {
  return chain =>
    chain
      .batch(applyStylesheet(...args))
      .batch(applyScssLess(...args))
      .batch(applyImage(...args))
      .batch(applyFont(...args))
      .batch(config => config.resolveLoader.modules.add(childNodeModules));
};
