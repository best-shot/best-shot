const action = require('../lib/action');

exports.command = 'analyze';

exports.describe = `Generate bundle analysis report`;

exports.handler = action;
