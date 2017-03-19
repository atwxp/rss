/**
 * @file   webpack base config entry
 * @author wxp201013@163.com
 */

import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const SRC_PARH = 'src'

const OUTPUT_PATH = 'output'

const abs = function (p) {
    return path.join(__dirname, p)
}

export default {
    context: abs(SRC_PARH),

    entry: './index.js',

    output: {
        path: abs(OUTPUT_PATH),

        filename: 'index.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },

            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },

            {
                test: /\.(eot|woff|woff2|ttf|svg)([a-z0-9\?#]+)?$/,
                use: ['file-loader']
            },

            {
                test: /\.vue$/,
                // use: ['vue']
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: 'css-loader'
                        })
                    }
                }
            }
        ]
    },

    devtool: 'source-map',

    plugins: [
        new ExtractTextPlugin('index.css'),

        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new CopyWebpackPlugin([
            {from: '../manifest.json'},
            {from: '../background.js'}
        ])
    ],

    resolve: {
        modules: [SRC_PARH, 'node_modules'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.json', '.vue']
    },

    devServer: {
        contentBase: __dirname + '/output',
        compress: true,
        port: 9000
    }
}
