const webpack = require('webpack');
console.log("webpack.prod.js called");

module.exports = {
    entry: ['./src/index.js'] ,

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
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
                }
            },
            {
                test: /\.(s*)css$/,
                loader : 'style-loader!css-loader!sass-loader'      // 아직 sass-loader 를 설치하지 않았는데 잘 돌아간다? 18-06-07
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({ mangle: true })
    ]
};
