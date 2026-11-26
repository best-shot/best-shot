import { execFileSync } from 'node:child_process';

const DEFAULT_IGNORE = [
  '**/.{cache,git,svn,ssh,yarn}/**',
  '**/.{npm,yarn}rc',
  '**/.env.*',
  '**/.env',
  '**/.git{keep,ignore}',
  '**/*.{pem,ppk}',
  '**/id_{d,r}sa',
  '**/ssh*config',
  '**/sshd*config',
];

// Mirrors copy-webpack's gitignore handling: paths git reports as ignored are
// turned into glob patterns so the built-in output.copy skips the same files.
function readGitignorePatterns(cwd) {
  try {
    const output = execFileSync(
      'git',
      [
        '-C',
        cwd,
        'ls-files',
        '--others',
        '--ignored',
        '--exclude-standard',
        '--directory',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );

    return output
      .split('\n')
      .filter(Boolean)
      .map((entry) => (entry.endsWith('/') ? `${entry}**` : entry));
  } catch {
    return [];
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

export function copyPatterns(options, cwd) {
  const globOptions = {
    dot: true,
    ignore: [...DEFAULT_IGNORE, ...readGitignorePatterns(cwd)],
  };

  return toArray(options).map((item) => {
    const pattern = typeof item === 'string' ? { from: item } : { ...item };
    // `hashbang` was a copy-webpack-only option and is rejected by the
    // built-in output.copy schema (additionalProperties: false).
    delete pattern.hashbang;

    return {
      globOptions,
      ...pattern,
    };
  });
}
