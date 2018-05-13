const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { modules: true } },
                ],
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
        }),
    ]
});

if (process.env.WEBPACK_SERVE) {
    module.exports.serve = {
        add(app) {
            const history = require('connect-history-api-fallback');
            const convert = require('koa-connect');
            app.use(convert(history()));
        },
        dev: {
            publicPath: '/',
        }
    }
}
