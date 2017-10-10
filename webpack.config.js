const HtmlWebpackPlugin = require('html-webpack-plugin')
const ClearWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
    entry: {
        ab: __dirname + '/src/ab.js',
        cd: __dirname + '/src/cd.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[hash].bundle.js',
        publicPath: './',
    },
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
            {
                test: /\.css$/, use: ExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            }),
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'ab.html',
            template: './index.html',
            chunks: ['ab'],
        }),

        new HtmlWebpackPlugin({
            filename: 'cd.html',
            template: './index.html',
            chunks: ['cd'],
        }),

        new ExtractTextWebpackPlugin('style/common.css'),
    ],
}
module.exports = config

module.exports.plugins = (module.exports.plugins || []).concat([
    // 构建之前，先删除dist目录下面的文件夹
    new ClearWebpackPlugin(['dist']),
]) 