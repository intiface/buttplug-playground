'use strict';
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require ('vuetify-loader/lib/plugin');

const base = {
  mode: "development",
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  entry: path.resolve('./src/main.ts'),
  output: {
    path: path.resolve('./dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /tests|example/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true
          }
        }]
      },
      {
        test: /\.vue$/,
        use: [{
          loader:'vue-loader',
          options: {
            loaders: {
              esModule: true
            }
          }
        }]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]?[hash]'
          }
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.md$/,
        use: ['html-loader', 'markdown-loader']
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: 'html-loader'
        }]
      },
      {
        test: /\.wasm$/,
        type: "webassembly/experimental"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: '.'
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
  ],
  node: {
    fs: 'empty'
  },
};

const production =   {
  mode: "production",
  optimization: {
    minimize: true,
    mangleWasmImports: false
  },
  devtool: '#source-map',
};

module.exports = env => {
  switch(env) {
    case 'development':
      return base;
    case 'production':
      return merge(base, production);
    default:
      throw new Error('No matching configuration was found!');
  }
}