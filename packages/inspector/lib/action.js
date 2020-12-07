/* eslint-disable global-require */
const sortObject = require('sort-object');
const BestShot = require('@best-shot/core');

const { errorHandle, commandMode } = require('@best-shot/cli/lib/utils');

const concatStr = require('./concat-str');
const makeWriteFile = require('./write-file');

const commands = ['serve', 'watch', 'dev', 'prod'];

module.exports = function action({ stamp = 'none' }) {
  console.log('Output files ...');

  errorHandle(function main() {
    const readConfig = require('@best-shot/cli/lib/read-config');

    const rootPath = process.cwd();
    const writeFile = makeWriteFile(rootPath, stamp);

    commands.forEach((command) => {
      const mode = commandMode(command);
      const configs = readConfig(rootPath)({ command });

      if (configs.length === 1 && command === 'serve') {
        configs[0].presets = ['serve', ...(configs[0].presets || [])];
      }

      configs.forEach((config) => {
        const { chain, name, presets = [], ...rest } = config;

        const io = new BestShot({ name, presets });

        writeFile({
          name: `${name ? `${name}/` : ''}${command}.js`,
          data: concatStr({
            stamp,
            input: sortObject({
              mode,
              command,
              presets,
              config: rest,
              ...(chain ? { chain } : undefined),
            }),
            schema: io.schema.toObject(),
            output: io
              .setup({
                watch: ['watch', 'serve'].includes(command),
                mode,
                config: rest,
              })
              .when(typeof chain === 'function', chain),
          }),
        });
      });
    });
  });
};
