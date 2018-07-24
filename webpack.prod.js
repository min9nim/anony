const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

//console.log("webpack.prod.js called");

module.exports = {
    mode: 'production',
    
    entry: {
        index : ['./src/index.js']
    },

    output: {
        path: __dirname + '/public/',
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
        ]
    }    

};
