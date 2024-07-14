import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { parse as parseJson } from 'jsonc-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workspaceConfig = parseJson(
  fs.readFileSync(
    path.resolve(__dirname, '../../.vscode/open-browser-monorepo.code-workspace'),
    'utf8',
  ),
);

let scopes = workspaceConfig.folders.map((item) => item.name.toLowerCase());

const SCOPE_CACHE_PATH = path.resolve(
  __dirname,
  '.././.git/scope-cache.json',
);

// @see https://github.com/Zhengqbbb/czgit-playground/blob/cache-scope/commitlint.config.cjs
const setCacheScope = (scope) => {
  if (!scope || scopes.includes(scope)) return;
  if (!fs.existsSync(SCOPE_CACHE_PATH)) {
    fs.writeFileSync(
      SCOPE_CACHE_PATH,
      JSON.stringify([scope], null, 2),
      'utf8',
    );
  } else {
    const tmp = new Set(
      JSON.parse(fs.readFileSync(SCOPE_CACHE_PATH, 'utf8')),
    );
    tmp.add(scope);
    fs.writeFileSync(
      SCOPE_CACHE_PATH,
      JSON.stringify([...tmp], null, 2),
      'utf8',
    );
  }
};

const getCacheScope = () => {
  if (!fs.existsSync(SCOPE_CACHE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(SCOPE_CACHE_PATH, 'utf8'));
};

scopes = [...scopes, ...getCacheScope()];

const formatMessageCB = ({ scope }) => {
  // eslint-disable-next-line no-control-regex
  setCacheScope(scope.replaceAll(/\x1B\[[0-9;]*[mG]/g, ''));
};

export { scopes, formatMessageCB as formatMessageCBForCacheScope };
