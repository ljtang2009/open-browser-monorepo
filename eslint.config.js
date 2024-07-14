import globals from 'globals';
import { eslint, disableDuplicatedRules } from '@ljtang2009/lint-configuration';
import _ from 'lodash';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseConfig = _.merge(
  _.cloneDeep(eslint.buildIn.default),
  eslint.stylisticPlus.default,
  eslint.stylisticJs.default,
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
);

const baseTSConfig = _.merge(
  _.cloneDeep(baseConfig),
  eslint.stylisticTs.default,
  eslint.ts.default,
);

let config = [
  {
    name: 'js',
    ..._.merge(_.cloneDeep(baseConfig), {
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      ignores: [
        'dist/**/*',
        'coverage/**/*',
        'packages/**/*',
      ],
    }),
  },
  {
    name: 'ts/root',
    ..._.merge(_.cloneDeep(baseTSConfig), {
      files: [
        '*.ts',
      ],
      languageOptions: {
        parserOptions: {
          project: path.join(import.meta.url, 'tsconfig.node.json'),
          tsconfigRootDir: __dirname,
        },
      },
    }),
  },
  {
    name: 'json',
    ..._.merge(_.cloneDeep(eslint.json.default), {
      files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
      ignores: [
        'coverage/**/*',
        'package.json',
        'packages/**/*',
      ],
    }),
  },
];

// 禁用重复规则
config = disableDuplicatedRules(config);

export default config;
