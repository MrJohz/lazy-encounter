const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/js/index.tsx',
    output: {
        filename: 'public/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ]
};
