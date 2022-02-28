const config = require('../base');

config.settings = {
  ...config.settings,
  react: {
    version: 'detect',
  },
};
config.rules = {
  ...config.rules,
  'no-console': 'warn',
  'react/jsx-curly-newline': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/require-default-props': 'off',
  'react/jsx-props-no-spreading': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
};

module.exports = config;
