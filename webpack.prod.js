const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

//console.log("webpack.prod.js called");

module.exports = {
    mode: 'production',
    
    entry: {
        index : './src/index.js',
        react : ["react", "react-dom", "react-router-dom"],
        //lib : ["moment", 'react-bootstrap']
    },

    output: {
        path: __dirname + '/public/',
        publicPath: "/",        // chunk 파일을 / 에서 로드하도록 설정
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react"],
                        plugins: ['syntax-dynamic-import']
                    }                    
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],

    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ],
        splitChunks: {
            chunks: 'async',    // include all types of chunks
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 10,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
              default: false
            }
        }
    }    

};
