const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-custom-properties'),
        require('postcss-custom-media'),
        require('postcss-apply'),
        require('postcss-nested'),
        require('autoprefixer')({
            browsers: [
                'last 2 versions',
                'Safari >= 8',
                'iOS >= 8',
                'Android >= 4.4'
            ]
        }),
        isProduction ? require('cssnano')({
            safe: true
        }) : null
    ].filter(Boolean)
}
