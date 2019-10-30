'use strict';

function commandEnv(command) {
  return (
    {
      dev: 'development',
      serve: 'development',
      watch: 'development',
      prod: 'production'
    }[command] || 'development'
  );
}

module.exports = {
  commandEnv
};
