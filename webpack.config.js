const webpack = require('webpack');

module.exports = {
    entry: ['react-hot-loader/patch', './src/index.js'] ,

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
        /* devServer 는 변경사항 발생시 메모리에 bundle.js 를 배포하고 해당 파일?을 바라보며 서비스된다 */
        hot: true,
        inline: true,
        //publicPath: '/',      // 이건 무슨 설정인지 몰라서 일단 주석처리 해놓음
        historyApiFallback: true,       // 404 일 경우 /index.html 로 서비스
        host: '0.0.0.0',
        port: 7777,
        contentBase: __dirname + '/public/',
        disableHostCheck: true,     // 외부에서 접속 허용
        proxy: {
            "*": "http://localhost:8080"
        }
    },

    module:{
        loaders: [
            {
                test: /.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ["react-hot-loader/babel"]
                }
            },
            {
                test: /\.(s*)css$/,
                //loader : ['style-loader', 'css-loader', 'sass-loader']
                loader : 'style-loader!css-loader!sass-loader'      // 아직 sass-loader 를 설치하지 않았는데 잘 돌아간다? 18-06-07
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
