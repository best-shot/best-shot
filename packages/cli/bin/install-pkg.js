'use strict';

function findPkg() {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('@best-shot/inspector');
  } catch (error) {
    return undefined;
  }
}

module.exports = function installPkg(app) {
  const inspector = findPkg();
  if (inspector) {
    app.command(inspector);
  }
};
