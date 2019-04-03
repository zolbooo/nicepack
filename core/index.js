const isProductionMode = process.env.NODE_ENV === "production";

const fs = require("fs");
const path = require("path");
const currentDirectory = process.cwd();

const outputFilename = "static/js/[name].[contenthash:8].js";
const CSSoutputFilename = "static/css/[name].[contenthash:8].chunk.css";

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserPlugin = require("terser-webpack-plugin");
const TerserConfig = require(path.join(
  __dirname,
  "config",
  "terser.config.js"
));

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CSSOptimizerConfig = require(path.join(
  __dirname,
  "config",
  "css.optimize.js"
));
const PostCSSConfig = require(path.join(
  __dirname,
  "config",
  "postcss.config.js"
));

const styleLoaders = (useModules, ...additionalLoaders) => {
  let cssLoaderOptions = {
    modules: useModules,
    sourceMap: true,
    importLoaders: 1 + additionalLoaders.length
  };
  if (useModules)
    cssLoaderOptions.localIdentName = isProductionMode
      ? "[hash:base64:5]"
      : "[local]__[hash:base64:5]";

  let loaders = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: cssLoaderOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: PostCSSConfig
    }
  ];
  loaders.push(...additionalLoaders);
  return loaders;
};

const srcPath = path.join(currentDirectory, "src");
const distPath = path.join(currentDirectory, "dist");
const assetsPath = path.join(srcPath, "assets");

const config = options => ({
  mode: isProductionMode ? "production" : "development",
  entry: [path.join(srcPath, "index.js")],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          enforce: true
        }
      }
    },
    sideEffects: true,
    usedExports: true,
    runtimeChunk: true,
    minimize: isProductionMode,
    minimizer: [
      new TerserPlugin(TerserConfig),
      new OptimizeCSSAssetsPlugin(CSSOptimizerConfig)
    ]
  },
  output: {
    path: distPath,
    filename: outputFilename,
    chunkFilename: outputFilename,
    publicPath: options.publicPath
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.join(__dirname, "config", "babel.loader.js"),
            options: {
              root: path.join(currentDirectory, "src"),
              ...options.babel
            }
          }
        ]
      },
      options.css,
      options.sass,
      ...options.modules
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProductionMode)
    }),
    new MiniCssExtractPlugin({
      filename: CSSoutputFilename,
      chunkFilename: CSSoutputFilename
    }),
    new HtmlWebpackPlugin({
      template: path.join("public", "index.html"),
      inject: true,
      minify: options.htmlMinifyOptions
    }),
    new CleanWebpackPlugin([distPath], {
      verbose: false,
      allowExternal: true
    }),
    new CopyWebpackPlugin(options.copyPaths),
    ...options.plugins
  ],
  stats: options.stats,
  devServer: options.devServer,
  resolve: {
    alias: {
      "@": path.join(currentDirectory, "src")
    },
    extensions: [".js", ".jsx", ".scss", ".sass", ".css", ...options.extensions]
  }
});

module.exports = (...plugins) => {
  let options = {
    devServer: {},
    stats: { children: false },
    babel: require(path.join(__dirname, "config", "babel.config.js")),
    css: {
      test: /\.css$/,
      use: styleLoaders(false)
    },
    sass: {
      test: /\.(scss|sass)$/,
      use: styleLoaders(false, "sass-loader")
    },
    css: {
      test: /.m(odule)?\.css$/,
      use: styleLoaders(true)
    },
    sass: {
      test: /.m(odule)?\.(scss|sass)$/,
      use: styleLoaders(true, "sass-loader")
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
      minifyURLs: true
    },
    modules: [],
    plugins: [],
    extensions: [],
    copyPaths: [
      {
        from: "public",
        ignore: ["index.html"]
      }
    ],
    publicPath: "/"
  };
  if (fs.existsSync(assetsPath))
    options.copyPaths.push({
      from: assetsPath,
      to: "assets"
    });
  plugins.forEach(plugin => plugin(options));
  let webpackConfig = config(options);
  if (!isProductionMode)
    Object.assign(webpackConfig, { devtool: "inline-source-map" });
  return webpackConfig;
};
module.exports.styleLoaders = styleLoaders;
