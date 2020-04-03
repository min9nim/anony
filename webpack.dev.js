const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
  mode: 'development',
  entry: {
    dev: 'react-hot-loader/patch',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              'react-hot-loader/babel',
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
    ],
  },

  devServer: {
    /* devServer 는 변경사항 발생시 메모리에 bundle.js 를 배포하고 해당 파일?을 바라보며 서비스된다 */
    hot: true,
    inline: true,
    // publicPath: __dirname + '/public/', // 이건 무슨 설정인지 몰라서 일단 주석처리 해놓음
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.dev.html' }],
    },
    host: '0.0.0.0',
    port: 8000,
    contentBase: path.join(__dirname, 'public'),
    disableHostCheck: true, // 외부에서 접속 허용
    // proxy: {
    // '/api/*': 'http://localhost:8080',
    // '/index.html': 'http://localhost:8080',
    // '/': 'http://localhost:8080',
    // },
    open: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: 'docs/size_dev.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: false,
    //   statsFilename: 'docs/stats_dev.json',
    // }),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
})
