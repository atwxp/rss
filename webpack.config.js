var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var SRC_PARH = 'src';
var OUTPUT_PATH = 'output';

var abs = function (p) {
    return path.join(__dirname, p);
};

module.exports = {
    context: abs(SRC_PARH),

    entry: './index',

    output: {
        path: abs(OUTPUT_PATH),

        filename: 'index.js',

        publicPath: '/output/'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                loader: 'less!style!css'
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)([a-z0-9\?#]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpe?g|png)$/,
                loader: 'file-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            }
        ]
    },

    devtool: 'source-map',

    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('css?sourceMap'),
            less: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
        }
    },

    plugins: [
        new ExtractTextPlugin('index.css'),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],

    resolve: {
        extensions: ['', '.js', '.vue']
    }
};
