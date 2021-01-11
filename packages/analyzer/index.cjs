const action = require('./lib/action.cjs');

exports.command = 'analyze';

exports.describe = `Generate bundle analysis report`;

exports.handler = action;
