const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  mode: 'development',
  entry: {
    dev: 'react-hot-loader/patch',
    index: './src/index.js',
    react: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap'],
  },

  //entry: './src/index.js',

  output: {
    path: __dirname + '/public/',
    publicPath: '/', // chunk 파일을 / 에서 로드하도록 설정
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['react-hot-loader/babel', 'syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
    ],
  },

  devServer: {
    /* devServer 는 변경사항 발생시 메모리에 bundle.js 를 배포하고 해당 파일?을 바라보며 서비스된다 */
    hot: true,
    inline: true,
    //publicPath: '/',      // 이건 무슨 설정인지 몰라서 일단 주석처리 해놓음
    historyApiFallback: true, // 404 일 경우 /index.html 로 서비스
    host: '0.0.0.0',
    port: 8000,
    contentBase: __dirname + '/public/',
    disableHostCheck: true, // 외부에서 접속 허용
    proxy: {
      '/api/*': 'http://localhost:8080',
      '/index.html': 'http://localhost:8080',
      '/': 'http://localhost:8080',
    },
  },

  optimization: {
    splitChunks: {
      chunks: 'all', // include all types of chunks
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        default: false,
      },
    },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin({
    //     analyzerMode: "static",
    //     reportFilename: "docs/size_dev.html",
    //     defaultSizes: "parsed",
    //     openAnalyzer: false,
    //     generateStatsFile: false,
    //     statsFilename: "docs/stats_dev.json",
    // })
  ],
}
