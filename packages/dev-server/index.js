const setOptions = require('@best-shot/cli/lib/set-options');
const action = require('@best-shot/cli/lib/action');

exports.command = 'serve';

exports.describe = 'Same as `dev` command with `dev-server`';

exports.builder = setOptions.watch;

exports.handler = action;
