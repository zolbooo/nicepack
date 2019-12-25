const fs = require('fs');
const path = require('path');

module.exports = config => {
  config.babel.plugins.push([
    '@babel/plugin-transform-typescript',
    { isTSX: true, allExtensions: true },
  ]);
  config.extensions.push('.ts', '.tsx');
  config.modules[0].test = /\.(tsx?|jsx?)$/;
  config.entry = () => {
    const paths = [
      path.join(process.cwd(), 'src', 'index.ts'),
      path.join(process.cwd(), 'src', 'index.tsx'),
      path.join(process.cwd(), 'src', 'index.js'),
      path.join(process.cwd(), 'src', 'index.jsx'),
    ];
    return paths.find(path => fs.existsSync(path));
  };
};
