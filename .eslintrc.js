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
    'no-console': 0
  },
  globals: {
    'chrome': true,
    '$': true,
    'Promise': true,
    'Tour': true
  }
};
