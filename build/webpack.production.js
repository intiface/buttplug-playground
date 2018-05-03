'use strict';
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  devtool: '#source-map',
  // Turn off default minification, since it hoses buttplug.
  optimization: {
    minimize: false,
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
      parallel: true,
      cache: true,
      uglifyOptions: {
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
