module.exports = {
  commandEnv(command) {
    return (
      {
        dev: 'development',
        serve: 'development',
        watch: 'development',
        prod: 'production',
      }[command] || 'development'
    );
  },
};
