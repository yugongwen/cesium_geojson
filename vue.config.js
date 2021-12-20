module.exports = {
    lintOnSave:false,
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: '@open-wc/webpack-import-meta-loader',
                    },
                },
            ],
        },
    },
}
