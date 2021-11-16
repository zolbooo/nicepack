module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['*.js'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/prefer-default-export': 'off',
    'import/newline-after-import': 'off',
    '@typescript-eslint/indent': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
    'import/no-unresolved': 'off',
    'consistent-return': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    // Following rules should be disabled in the base config
    'react/jsx-filename-extension': 'off',
    // Following rules are throwing errors
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
