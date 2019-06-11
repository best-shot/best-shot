'use strict';

function findPkg(pkg) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(pkg);
  } catch (error) {
    return undefined;
  }
}

module.exports = function installPkg(app) {
  const inspector = findPkg('@best-shot/inspector');
  if (inspector) {
    app.command(inspector);
  }
};
