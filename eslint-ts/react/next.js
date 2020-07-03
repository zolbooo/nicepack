const config = require("./index");

config.rules = {
  ...config.rules,
  "import/no-cycle": "off",
  "jsx-a11y/anchor-is-valid": "off",
  "import/no-extraneous-dependencies": "off",
  "jsx-a11y/control-has-associated-label": "off",
};

module.exports = config;
