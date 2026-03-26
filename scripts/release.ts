/* eslint-disable no-console */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const bump = process.argv[2];

if (!bump || !['patch', 'minor', 'major'].includes(bump)) {
  console.error('Usage: pnpm release <patch|minor|major>');
  process.exit(1);
}

try {
  console.log('Running verification...');
  execSync('pnpm verify', { stdio: 'inherit' });

  console.log(`\nBumping ${bump} version...`);
  execSync(`pnpm version ${bump} --no-git-tag-version`, { stdio: 'inherit' });

  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
    version: string;
  };
  console.log(`\nBumped to v${pkg.version}`);
} catch {
  console.error('\nRelease failed.');
  process.exit(1);
}
