const handle = require('./handle');
const { commandEnv } = require('./utils');
const { applyProgress, applyAnalyzer } = require('./apply');
const { reachConfig, reachBrowsers } = require('./reach');

const rootPath = process.cwd();

module.exports = function action({
  _: [command],
  platform,
  custom,
  progress,
  analyze,
}) {
  const mode = commandEnv(command);

  function getConfig() {
    const configFunc = reachConfig(rootPath);

    const { webpackChain, presets = [], ...config } = configFunc({
      command,
      custom,
      platform,
    });

    if (command === 'serve') {
      presets.unshift('serve');
    }

    // eslint-disable-next-line global-require
    const BestShot = require('@best-shot/core');
    return new BestShot({ presets })
      .load({
        options: {
          watch: ['watch', 'serve'].includes(command),
        },
        mode,
        browsers: reachBrowsers(rootPath, mode),
        config,
        platform,
        rootPath,
      })
      .when(typeof webpackChain === 'function', webpackChain)
      .when(progress, applyProgress)
      .when(analyze, applyAnalyzer)
      .toConfig();
  }

  handle(command, getConfig);
};
