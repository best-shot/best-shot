const { builder } = require('@best-shot/cli/cmd/watch');

const action = require('../lib/action');

exports.command = 'serve';

exports.describe = 'Same as `dev` command with `dev-server`';

exports.builder = builder;

exports.handler = action;
