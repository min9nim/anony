const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: 'docs/size_prod.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: false,
    //   statsFilename: 'docs/stats_prod.json',
    // }),
  ],

  // optimization: {
  //   minimizer: [new UglifyJsPlugin()],
  // },
})
