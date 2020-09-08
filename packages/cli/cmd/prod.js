const { cyan } = require('chalk');

const { builder, handler } = require('./dev');

exports.command = 'prod';

exports.describe = `Bundle files in ${cyan('production')} mode`;

exports.builder = builder;

exports.handler = handler;
