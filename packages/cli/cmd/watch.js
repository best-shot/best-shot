const action = require('../lib/action');

exports.command = 'watch';

exports.describe = 'Same as `dev` command in watch mode';

exports.handler = action;
