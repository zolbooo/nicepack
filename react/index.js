const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = config => {
  config.babel.presets.push('@babel/preset-react');
  if (process.env.NODE_ENV !== 'production') {
    config.babel.plugins.push('react-refresh/babel');
    config.plugins.push(new ReactRefreshPlugin({ disableRefreshCheck: true }));
    config.devServer.hot = true;
  }
};
