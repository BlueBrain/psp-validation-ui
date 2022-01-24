
/* eslint-disable @typescript-eslint/no-var-requires */
process.env.VUE_APP_VERSION = require('./package.json').version;
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  publicPath: process.env.BASE_URL || '/',
};
