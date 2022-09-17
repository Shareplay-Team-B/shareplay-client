const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const env = require('./build-scripts/env');

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'popup.js'),
    background: path.join(__dirname, 'src', 'background.js'),
    content: path.join(__dirname, 'src', 'content.js'),
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
          // look for .css or .scss files
          test: /\.(css|scss)$/,
          // in the `src` directory
          use: [
              {
                  loader: 'style-loader',
              },
              {
                  loader: 'css-loader',
              },
              {
                  loader: 'sass-loader',
                  options: {
                      sourceMap: true,
                  },
              },
          ],
      },
      // {
      //     test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
      //     loader: 'file-loader?name=[name].[ext]',
      //     exclude: /node_modules/,
      // },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: fileExtensions
      .map((extension) => `.${extension}`)
      .concat(['.jsx', '.js', '.css']),
  },
  plugins: [
    new ESLintPlugin(options),
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'dist'),
          force: true,
          transform(content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify(
                {
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                },
                null,
                '\t',
              ),
            );
          },
        },
        {
          from: 'src/pages',
          to: path.join(__dirname, 'dist', 'pages'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WriteFilePlugin(),
  ],
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
}

module.exports = options;
