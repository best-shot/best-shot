const { builder } = require('@best-shot/cli/cmd/watch');

exports.command = 'analyze';

exports.describe = `Generate bundle analysis report`;

exports.builder = builder;

exports.handler = () => {};
