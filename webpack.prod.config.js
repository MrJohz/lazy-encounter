const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    devtool: 'source-map ',
    mode: 'production',
    optimization: {
        splitChunks: { chunks: 'all' },
        runtimeChunk: true,
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { modules: true } }
                ]
            }
        ]
    }
});
