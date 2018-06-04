const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const DIST_PATH = path.resolve(__dirname, '..', 'dist');
const SRC_PATH = path.resolve(__dirname, '..', 'src');

module.exports = {
    ROOT_PATH, DIST_PATH, SRC_PATH,
    defaultConfig: {
        entry: './src/js/index.tsx',
        output: {
            filename: 'public/[name].[hash].js',
            path: DIST_PATH,
            publicPath: '/',
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            ]
        },
    },

    plugins(...plugins) {
        return [...this.prependPlugins, ...plugins, ...this.appendPlugins];
    },

    prependPlugins: [new CleanWebpackPlugin(['dist'], { root: ROOT_PATH })],
    appendPlugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
        }),
    ],

    modules: {
        'css': [
            { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
            { loader: 'postcss-loader' },
        ],
    },
};
