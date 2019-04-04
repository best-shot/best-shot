const BestShot = require('@best-shot/core');
const { commandEnv, logRedError } = require('@best-shot/core/lib/common');
const { applyProgress, applyAnalyzer } = require('../apply');
const handle = require('./index');
const { reachConfig, reachBrowsers, reachDependencies } = require('../reach');

module.exports = function action({
  _: [command],
  config: configPath,
  platform,
  custom,
  progress,
  analyze
}) {
  const rootPath = process.cwd();
  const mode = commandEnv(command);
  const configFunc = reachConfig(rootPath, configPath);
  const dependencies = reachDependencies(rootPath);
  const browsers = reachBrowsers(rootPath)[mode];

  try {
    const { webpackChain, presets, ...config } = configFunc({
      command,
      custom,
      platform,
      analyze
    });

    if (command === 'serve') {
      presets.unshift('serve');
    }

    const io = new BestShot({ presets })
      .load({
        options: {
          watch: command === 'watch',
          serve: command === 'serve'
        },
        rootPath,
        dependencies,
        mode,
        config,
        platform,
        browsers
      })
      .when(typeof webpackChain === 'function', webpackChain)
      .when(command === 'watch' || command === 'serve', conf =>
        conf.watch(true)
      )
      .when(progress, applyProgress)
      .when(analyze, applyAnalyzer);

    handle(command, io);
  } catch (err) {
    logRedError(err.message, err.extra);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};
