import chalk from 'chalk';

const { cyan } = chalk;

export const command = 'prod';

export const describe = `Bundle files in ${cyan('production')} mode`;

export { builder, handler } from './dev.mjs';
