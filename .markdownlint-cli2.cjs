const lintConfiguration = require('@ljtang2009/lint-configuration');
const _ = require('lodash');

// @note Because JavaScript code is cached after being loaded, edits to .markdownlint.cjs and .markdownlint-cli2.cjs require a restart of VS Code.

module.exports = _.merge(_.cloneDeep(lintConfiguration.markdownlint.default), {
  ignores: ['packages/**/*'],
});
