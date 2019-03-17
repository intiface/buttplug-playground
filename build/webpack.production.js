'use strict';
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  devtool: '#source-map',
  // Turn off default minification, since it hoses buttplug.
  optimization: {
    minimize: false,
  },
  plugins: [
    new TerserPlugin({
      sourceMap: true,
      parallel: true,
      terserOptions: {
        mangle: {
          keep_classnames: true,
          keep_fnames: true
        },
        compress: {
          keep_fnames: true,
          keep_classnames: true,
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
});
