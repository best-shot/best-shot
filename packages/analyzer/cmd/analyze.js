const { builder } = require('@best-shot/cli/cmd/watch');

const action = require('../lib/action');

exports.command = 'analyze';

exports.describe = `Generate bundle analysis report`;

exports.builder = builder;

exports.handler = action;
