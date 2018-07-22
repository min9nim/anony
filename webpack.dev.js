const webpack = require('webpack');
//console.log("webpack.dev.js called..");

module.exports = {
    mode: 'development',

    entry: ['react-hot-loader/patch', './src/index.js'] ,

    output: {
        path: __dirname + '/public/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
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
            "/api/*" : "http://localhost:8080",
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(s*)css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            }
        ]
    },



    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
