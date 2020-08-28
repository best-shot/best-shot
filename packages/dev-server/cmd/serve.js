const { builder, handler } = require('@best-shot/cli/cmd/watch');

exports.command = 'serve';

exports.describe = 'Same as `dev` command with `dev-server`';

exports.builder = builder;

exports.handler = handler;
