/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const BannerPlugin = require('webpack').BannerPlugin;
const webpack = require('webpack');

const entry = fs
  .readdirSync('./src/application/handlers', { withFileTypes: true })
  .filter(file => file.isFile())
  .map(file => path.parse(file.name).name)
  .filter(file => !/[a-z]+.ts$/i.test(file))
  .filter(file => !/^@/.test(file))
  .reduce(
    (accumulator, file) => ({
      ...accumulator,
      [`${file}`]: `./src/application/handlers/${file}`,
    }),
    {},
  );

module.exports = {
  entry,
  resolve: {
    extensions: ['.ts', '.js', '.json', '.csv'],
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
       {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      },
      {
        test: /\.png$/i,
        use: 'file-loader',
      },
    ],
  },

    // Set the webpack mode
  mode: process.env.NODE_ENV || "production",
  
  devtool:  "source-map",
  plugins: [
    new BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),

    new webpack.IgnorePlugin(/^pg-native$/)
  ],
};
