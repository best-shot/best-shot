const action = require('../lib/action.cjs');

exports.command = 'watch';

exports.describe = 'Same as `dev` command in watch mode';

exports.handler = action;
