const merge = require('webpack-merge');
const common = require('./common.config');

module.exports = merge(common.defaultConfig, {
    mode: 'development',
    devtool: 'eval-source-map',

    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    { loader: 'style-loader' },
                    ...common.modules.css,
                ],
            },
        ]
    },

    plugins: common.plugins(),
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
