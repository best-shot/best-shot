import fs from 'fs-extra';
import { join } from 'path';

const { outputFileSync } = fs;

export function makeWriteFile(rootPath, stamp) {
  return function writeFile({ name, data }) {
    const fileName = join(rootPath, '.best-shot', 'inspect', stamp, name);

    try {
      outputFileSync(fileName, data);
      console.log('-', name);
    } catch (error) {
      console.error(error);
    }
  };
}
