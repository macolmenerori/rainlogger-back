import { readFileSync } from 'fs';
import path from 'path';

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8')) as {
  version: string;
};

export const APP_VERSION: string = pkg.version;
