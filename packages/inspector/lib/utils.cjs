'use strict';

function isSafeError(error) {
  return (
    error.code === 'MODULE_NOT_FOUND' &&
    error.requireStack &&
    error.requireStack[0] === __filename
  );
}

module.exports = {
  isInstalled(name) {
    try {
      require.resolve(name);
      return true;
    } catch (error) {
      if (!isSafeError(error)) {
        return false;
      }
      throw error;
    }
  },
};
