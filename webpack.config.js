const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
	entry: {
		ab:__dirname + '/src/ab.js',
		cd:__dirname + '/src/cd.js',
	},
	output:{
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]-[hash].bundle.js'
	},
	module:{
		rules:[
			{test:/\.txt$/, use:'raw-loader'}
		]
	},
	plugins:[
	new HtmlWebpackPlugin({ filename:'ab.html', 
		                    template:'./index.html',
		                    chunks:['ab']}),

	new HtmlWebpackPlugin({
		filename:'cd.html',
		template:'./index.html',
		chunks:['cd']})

	]
}
module.exports = config;