const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';

const extractSass = new ExtractTextPlugin({
	filename: '[name].css',
	disable: process.env.NODE_ENV === 'development',
	allChunks: true
});

const htmlWebpack = new HTMLWebpackPlugin({
	title: 'Datepicker Training App',
	inject: true,
	template: './src/index.html',
	cache: false,
	production: false
});

module.exports = {
	entry: {
		bundle: path.resolve(__dirname, 'src/index.ts')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		modules: [
			'node_modules'
		]
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader'
						}
					],
					fallback: 'style-loader'
				})
			},
			{
				test: /\.ts$/,
				include: [
					path.join(__dirname, 'src')
				],
				use: {
					loader: 'awesome-typescript-loader'
				}
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist')
	},
	plugins: [
		extractSass,
		htmlWebpack
	],
	devtool: DEBUG ? 'inline-source-map' : 'hidden-source-map'
};
