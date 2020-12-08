/* eslint-disable global-require */
const sortObject = require('sort-object');
const BestShot = require('@best-shot/core');

const { errorHandle, commandMode } = require('@best-shot/cli/lib/utils');

const concatStr = require('./concat-str');
const makeWriteFile = require('./write-file');

module.exports = function action({ stamp = 'none' }) {
  console.log('Output files ...');

  const commands = ['watch', 'dev', 'prod'];

  let autoAddPreset;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    autoAddPreset = require('@best-shot/dev-server/lib/utils').autoAddPreset;
    if (autoAddPreset) {
      commands.unshift('serve');
    }
  } catch (error) {
    if (
      error.code === 'MODULE_NOT_FOUND' &&
      error.requireStack[0] === __filename
    ) {
      // do nothing.
    }
  }

  errorHandle(function main() {
    const readConfig = require('@best-shot/cli/lib/read-config');

    const rootPath = process.cwd();
    const writeFile = makeWriteFile(rootPath, stamp);

    commands.forEach((command) => {
      const mode = commandMode(command);
      const configs = readConfig(rootPath)({ command });

      if (command === 'serve') {
        autoAddPreset(configs);
      }

      configs.forEach((config) => {
        const { chain, name, presets = [], ...rest } = config;

        const io = new BestShot({
          name,
          presets:
            command === 'serve'
              ? presets
              : presets.filter((item) => item !== 'serve'),
        });

        const watch = ['watch', 'serve'].includes(command);

        writeFile({
          name: `${name ? `${name}/` : ''}${command}.js`,
          data: concatStr({
            stamp,
            input: sortObject({
              watch,
              name,
              mode,
              command,
              presets,
              config: rest,
              ...(chain ? { chain } : undefined),
            }),
            schema: io.schema.toObject(),
            output: io
              .setup({ watch, mode, config: rest })
              .when(typeof chain === 'function', chain),
          }),
        });
      });
    });
  });
};
