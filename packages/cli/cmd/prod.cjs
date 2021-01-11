const { cyan } = require('chalk');

const { builder, handler } = require('./dev.cjs');

exports.command = 'prod';

exports.describe = `Bundle files in ${cyan('production')} mode`;

exports.builder = builder;

exports.handler = handler;
