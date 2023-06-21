const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    instant: './instant.js',
    lever: './lever.js',
    gmail: './gmail.js',
    ashbyhq: './ashbyhq.js',
    bamboohr: './bamboohr.js',
    submitlever: './submitlever.js',
    submitgreenhouse: './submitgreenhouse.js',
    accesstoken: './accesstoken.js',
    // Add other entry points for each content script
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
