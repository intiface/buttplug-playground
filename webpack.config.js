'use strict';
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src|tests|example/,
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
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      'vue$': path.resolve('./node_modules/vue/dist/vue.esm.js'),
      'vue-material$': path.resolve('./node_modules/vue-material/dist/vue-material.js'),
      'buttplug$': path.resolve('./node_modules/buttplug/dist/main/src/index.js')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tslint: true
    }),
  ],
  node: {
    fs: 'empty'
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
          keep_classnames: true
        },
        compress: {
          keep_fnames: true,
          keep_classnames: true
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
