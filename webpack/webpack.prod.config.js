const merge = require('webpack-merge');
const common = require('./common.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common.defaultConfig, {
    devtool: 'source-map ',
    mode: 'production',
    optimization: {
        splitChunks: { chunks: 'all' },
        runtimeChunk: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ]
    },
    plugins: common.plugins(new MiniCssExtractPlugin({ filename: '[name].[hash].css' })),
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    ...common.modules.css,
                ]
            }
        ]
    }
});
