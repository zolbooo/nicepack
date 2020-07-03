const config = require('../base');

config.settings = {
  ...config.settings,
  react: {
    version: 'detect',
  },
};
config.rules = {
  ...config.rules,
  'react/jsx-curly-newline': 'off',
  'react/require-default-props': 'off',
  'react/jsx-props-no-spreading': 'off',
};

module.exports = config;
