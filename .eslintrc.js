module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
  },
  globals: {
    'chrome': true,
    'describe': true,
    'before': true,
    'it': true,
    'after': true
  }
};
