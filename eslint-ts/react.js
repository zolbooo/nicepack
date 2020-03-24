const config = require('./base');

config.settings = {
  react: {
    version: 'detect',
  },
};
config.rules = {
  ...config.rules,
  'react/jsx-props-no-spreading': 'off',
  'react/require-default-props': 'off',
};

module.exports = config;
