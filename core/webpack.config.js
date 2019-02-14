const isProductionMode = process.env.NODE_ENV === "production";

const fs = require("fs");
const path = require("path");
const currentDirectory = process.cwd();

const outputFilename = "static/js/[name].[hash:8].js";
const CSSoutputFilename = "static/css/[name].[contenthash:8].chunk.css";

const webpack = require("webpack");

const SriPlugin = require("webpack-subresource-integrity");
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

const styleLoaders = (...additionalLoaders) => {
  let loaders = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: {
        modules: true,
        sourceMap: true,
        importLoaders: 1 + additionalLoaders.length,
        localIdentName: isProductionMode
          ? "[hash:base64:5]"
          : "[local]__[hash:base64:5]"
      }
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

let config = {
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
    filename: outputFilename,
    chunkFilename: outputFilename,
    path: path.join(currentDirectory, "dist")
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
            options: Object.assign(
              { root: path.join(currentDirectory, "src") },
              require(path.join(__dirname, "config", "babel.config.js"))
            )
          }
        ]
      },
      {
        test: /\.css$/,
        use: styleLoaders()
      },
      {
        test: /\.scss$/,
        use: styleLoaders("sass-loader")
      }
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
      minify: {
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
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.join(currentDirectory, "src")
    },
    extensions: [".js", ".jsx", ".scss", ".sass", ".css"]
  }
};

const injectPlugins = (...plugins) => config.plugins.push(...plugins);

let copyPaths = [
  {
    from: "public",
    to: "dist",
    ignore: ["index.html"]
  }
];
if (fs.existsSync(path.join(currentDirectory, "src", "assets")))
  copyPaths.push({ from: path.join("src", "assets"), to: "assets" });
config.plugins.push(new CopyWebpackPlugin(copyPaths));

if (isProductionMode) {
  config.output.crossOriginLoading = "anonymous";
  injectPlugins(
    new SriPlugin({
      hashFuncNames: ["sha384"]
    }),
    new CleanWebpackPlugin([distPath], {
      verbose: false,
      allowExternal: true
    })
  );
} else {
  Object.assign(config, { devtool: "inline-source-map" });
}

module.exports = (...plugins) => {
  plugins.forEach(plugin => plugin(config));
  return config;
};
