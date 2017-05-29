const path = require('path');
const glob = require('glob');
const yaml = require('node-yaml');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const fileNameRule = '[name]';
const paths = (() => {
    const rootPath = __dirname;
    return {
        root: rootPath,
        nodeModules: path.join(rootPath, 'node_modules'),
        src: path.join(rootPath, 'src'),
        pages: path.join(rootPath, 'pages'),
        script: path.join(rootPath, 'script'),
        output: path.join(rootPath, 'docs')
    };
})();
const settings = yaml.readSync(path.join(paths.root, 'settings.yml'));
const pages = glob.sync(`${paths.pages}/**/*.ejs`)
    .filter((filepath) => !path.basename(filepath).startsWith('_'))
    .map((filepath) => {
        const filename = filepath
            .replace(paths.pages, '')
            .replace(/^\//, '')
            .replace(/\.ejs$/, '.html');
        return {
            filename,
            template: filepath
        };
    });

const extractVendorCSS = new ExtractTextPlugin('lib.css');
const extractBundleCSS = new ExtractTextPlugin('bundle.css');

module.exports = {
    bail: true,
    entry: {
        bundle: [
            path.join(paths.src, 'index.js')
        ],
        lib: [
            path.join(paths.nodeModules, 'ress', 'ress.css'),
            path.join(paths.nodeModules, 'swiper', 'dist', 'css', 'swiper.css'),
            path.join(paths.nodeModules, 'ionicons', 'css', 'ionicons.css'),
            'babel-polyfill'
        ]
    },
    output: {
        path: paths.output,
        publicPath: '/',
        filename: `${fileNameRule}.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /(src)/,
                use: extractVendorCSS.extract([
                    'css-loader'
                ])
            },
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: extractBundleCSS.extract([
                    'css-loader',
                    'postcss-loader'
                ])
            },
            {
                test: /\.(png|jpg|gif|svg|ico|ttf|woff2)$/,
                use: `file-loader?name=/${fileNameRule}.[ext]`
            },
            {
                test: /\/ionicons\/.+\.(woff|woff2|ttf|eot|svg)(\?.+)?$/,
                use: `file-loader?name=/${fileNameRule}.[ext]`
            }
        ]
    },
    plugins: [
        extractVendorCSS,
        extractBundleCSS
    ].concat(pages.map(({template, filename}) => {
        return new HtmlWebpackPlugin({
            filename,
            template: `${path.join(paths.script, 'loader.js')}!${template}`,
            hash: true,
            environment: process.env.NODE_ENV,
            settings: Object.assign({}, settings, {
                currentPath: filename.replace(/(^|\/)index\.html$/, '$1')
            })
        })
    }), [
        isProduction ? new UglifyJSPlugin() : null
    ]).filter(Boolean),
    devServer: {
        contentBase: path.join(paths.root, 'public')
    }
};
