'use strict';
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: "none",
  devtool: '#source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
      parallel: true,
      uglifyOptions: {
        mangle: {
          keep_classnames: true,
          keep_fnames: true
        },
        compress: {
          keep_fnames: true,
          keep_classnames: true,
          warnings: true
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
});
