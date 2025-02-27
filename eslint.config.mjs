import path from 'node:path';
const { dirname } = path;
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['**/.next/**', '**/node_modules/**', 'src/components/ui/**'],
  },
  ...compat.extends(
    'plugin:unicorn/recommended',
    'next/core-web-vitals',
    'next/typescript',
  ),
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
];

export default eslintConfig;
