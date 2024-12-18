const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

module.exports = {
  webpack: function override(config) {
    // Load environment variables from .env file
    const env = dotenv.config().parsed || {};
    
    // Prepare environment variables for webpack
    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});

    // Find and remove any existing DefinePlugin instances
    config.plugins = config.plugins.filter(plugin => 
      !(plugin instanceof webpack.DefinePlugin)
    );

    // Use fallback to provide an empty module for fs
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
      },
    };

    // Add our DefinePlugin with combined environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        ...envKeys,
        'process.env': JSON.stringify(process.env),
      })
    );

    return config;
  },
  jest: function(config) {
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      '^react-router-dom$': require.resolve('react-router-dom'),
    };

    // Transform ES modules
    config.transformIgnorePatterns = [
      '/node_modules/(?!(pdfjs-dist|file-type|mammoth|react-router|react-router-dom)/)',
    ];

    // Handle CSS imports in tests
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    };

    return config;
  }
};
