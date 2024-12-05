const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Fallback pour les modules Node.js
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
    "util": require.resolve("util/"),
    "url": require.resolve("url/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/"),
    "crypto": require.resolve("crypto-browserify"),
  };

  // Configure PDF.js worker
  config.resolve.alias = {
    ...config.resolve.alias,
    'pdfjs-dist': path.resolve(__dirname, './node_modules/pdfjs-dist/build/pdf'),
  };

  // Add necessary plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.REACT_APP_PDFJS_VERSION': JSON.stringify(process.env.REACT_APP_PDFJS_VERSION),
      'process.browser': true,
    }),
  ];

  return config;
}
