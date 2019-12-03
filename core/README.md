# nicepack

Nicepack - a nicer webpack config

## Getting started

Install `@nicepack/core`, `webpack`, `webpack-cli`, `webpack-dev-server`

Add `webpack.config.js`:

```
const nicepack = require("@nicepack/core");
module.exports = nicepack();
```

Create `src` and `public` folders. Add index.html template in `public`:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Your awesome app</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Add scripts in package.json:

```
...
"scripts": {
    "start": "./node_modules/.bin/webpack-dev-server --progress",
    "build": "NODE_ENV=production ./node_modules/.bin/webpack"
},
...
```

Note: you can create `src/assets` folder for your assets. They will be copied on build to `dist/assets`.

Create `src/index.js`.

Example:

```
console.log("Hello, nicepack!");
```

Run `npm start` to start development server, its address is `http://localhost:8080` by default.

v0.2.0:

Disabled css modules by default. In order to use css as module file must end with `m.css` or `module.css`.

## @nicepack/core

This is core package for nicepack.

How to use:

Add this to webpack.config.js in root of your project:

```
const nicepack = require("@nicepack/core");
module.exports = nicepack();
```

If you would like to use plugins, add them in nicepack call like this:

```
module.exports = nicepack(require("@nicepack/react"));
```

## Custom plugins for nicepack

You can write custom plugins adding new loaders, resolve extensions, and copy paths for CopyWebpackPlugin. You also can modify configuration for babel, css and sass loaders.

Example plugin(`@nicepack/react`):

```
module.exports = config => {
  config.babel.presets.push("@babel/preset-react");
};
```

### How to use

Plugin is called with `options` object:

```
options.babel - Babel configuration
options.css - CSS loader
options.sass - SASS loader
options.cssModule - CSS module loader
options.sassModule - SASS module loader
options.htmlMinifyOptions - HTML minifier options
options.modules - Add loaders for files like:
options.modules.push({
  test: /\.(scss|sass)$/,
  use: styleLoaders("sass-loader")
})
options.entry - Override default webpack entry
options.plugins - Add webpack plugins by pushing them there
options.extensions - Add resolve extensions
Default: [".js", ".jsx", ".scss", ".sass", ".css"]
options.copyPaths - Copy paths for CopyWebpackPlugin
Default: ["public/", "src/assets" (if exists)]
options.publicPath - Public path for output
Default: "/"
options.stats - This directly refers to webpack option `stats`
options.devServer - This directly refers to webpack option `devServer`
```

Plugins and loaders included:

- html-webpack-plugin
- copy-webpack-plugin
- clean-webpack-plugin
- terser-webpack-plugin
- mini-css-extract-plugin
- optimize-css-assets-webpack-plugin

Loaders:

- .css - css-loader, postcss-loader, mini-css-extract
- .scss, .sass - sass-loader, css-loader, postcss-loader, mini-css-extract
- .js, .jsx - babel-loader
  Included in babel:

```
@babel/preset-env
@babel/plugin-transform-runtime
@babel/plugin-syntax-dynamic-import
@babel/plugin-proposal-class-properties
```
