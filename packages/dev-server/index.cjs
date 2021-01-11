const { builder } = require('@best-shot/cli/cmd/watch.cjs');

const action = require('./lib/action.cjs');

exports.command = 'serve';

exports.describe = 'Same as `dev` command with `dev-server`';

exports.builder = builder;

exports.handler = action;
