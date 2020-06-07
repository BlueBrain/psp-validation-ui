
// eslint-disable-next-line
const fs = require('fs');
// eslint-disable-next-line
const webpack = require('webpack');

const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL
    : '/',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
    ],
  },
};
