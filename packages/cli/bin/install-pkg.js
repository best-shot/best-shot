function findPkg(name) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(name);
  } catch (err) {
    return undefined;
  }
}

module.exports = function installPkg(app, name) {
  const inspector = findPkg(name);
  if (inspector) {
    app.command(inspector);
  }
};
