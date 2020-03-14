const isProductionMode = process.env.NODE_ENV === 'production';

const fs = require('fs');
const path = require('path');
const currentDirectory = process.cwd();

const outputFilename = 'static/js/[name].[hash:8].js';
const CSSoutputFilename = 'static/css/[name].[hash:8].chunk.css';

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const TerserConfig = require(path.join(
  __dirname,
  'config',
  'terser.config.js',
));

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSOptimizerConfig = require(path.join(
  __dirname,
  'config',
  'css.optimize.js',
));
const PostCSSConfig = require(path.join(
  __dirname,
  'config',
  'postcss.config.js',
));

const styleLoaders = (useModules, ...additionalLoaders) => {
  let cssLoaderOptions = {
    modules: useModules,
    sourceMap: true,
    importLoaders: 1 + additionalLoaders.length,
  };
  if (useModules)
    cssLoaderOptions.localIdentName = isProductionMode
      ? '[hash:base64:5]'
      : '[local]__[hash:base64:5]';

  let loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: cssLoaderOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: PostCSSConfig,
    },
  ];
  loaders.push(...additionalLoaders);
  return loaders;
};

const srcPath = path.join(currentDirectory, 'src');
const distPath = path.join(currentDirectory, 'dist');
const assetsPath = path.join(srcPath, 'assets');

const config = options => ({
  mode: isProductionMode ? 'production' : 'development',
  entry: options.entry || [path.join(srcPath, 'index.js')],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
        },
      },
    },
    sideEffects: true,
    usedExports: true,
    runtimeChunk: true,
    minimize: isProductionMode,
    minimizer: [
      new TerserPlugin(TerserConfig),
      new OptimizeCSSAssetsPlugin(CSSOptimizerConfig),
    ],
  },
  output: {
    path: distPath,
    filename: outputFilename,
    chunkFilename: outputFilename,
    publicPath: options.publicPath,
  },
  module: {
    strictExportPresence: true,
    rules: [
      options.css,
      options.sass,
      options.cssModule,
      options.sassModule,
      ...options.modules,
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProductionMode),
    }),
    new MiniCssExtractPlugin({
      filename: CSSoutputFilename,
      chunkFilename: CSSoutputFilename,
    }),
    new HtmlWebpackPlugin({
      template: path.join('public', 'index.html'),
      inject: true,
      minify: options.htmlMinifyOptions,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(options.copyPaths),
    ...options.plugins,
  ],
  stats: options.stats,
  devServer: options.devServer,
  resolve: {
    alias: {
      '@': path.join(currentDirectory, 'src'),
    },
    extensions: [
      '.js',
      '.jsx',
      '.scss',
      '.sass',
      '.css',
      ...options.extensions,
    ],
  },
});

const cssModuleRegex = /\.m(odule)?\.css$/;
const sassModuleRegex = /\.m(odule)?\.(scss|sass)$/;

module.exports = (...plugins) => {
  let options = {
    devServer: {
      historyApiFallback: true,
      overlay: true,
      host: '0.0.0.0',
    },
    stats: { children: false },
    babel: require(path.join(__dirname, 'config', 'babel.config.js')),
    css: {
      test: /\.css$/,
      exclude: cssModuleRegex,
      use: styleLoaders(false),
      sideEffects: true,
    },
    sass: {
      test: /\.(scss|sass)$/,
      exclude: sassModuleRegex,
      use: styleLoaders(false, {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
        },
      }),
      sideEffects: true,
    },
    cssModule: {
      test: cssModuleRegex,
      use: styleLoaders(true),
    },
    sassModule: {
      test: sassModuleRegex,
      use: styleLoaders(true, {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
        },
      }),
    },
    htmlMinifyOptions: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    modules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              root: path.join(currentDirectory, 'src'),
            },
          },
        ],
      },
    ],
    plugins: [],
    extensions: [],
    copyPaths: [
      {
        from: 'public',
        ignore: ['index.html'],
      },
    ],
    publicPath: '/',
  };
  if (fs.existsSync(assetsPath))
    options.copyPaths.push({
      from: assetsPath,
      to: 'assets',
    });
  plugins.forEach(plugin => plugin(options));
  Object.assign(options.modules[0].use[0].options, options.babel);
  let webpackConfig = config(options);
  if (!isProductionMode)
    Object.assign(webpackConfig, { devtool: 'inline-source-map' });
  return webpackConfig;
};
module.exports.styleLoaders = styleLoaders;
