module.exports = function (source) {
    return `
    module.exports = function (templateParams) {
        const ejs = require('ejs');
        const result = ejs.render(${JSON.stringify(source)}, {
            compilation: templateParams.compilation,
            htmlWebpackPlugin: templateParams.htmlWebpackPlugin,
            webpack: templateParams.webpack,
            webpackConfig: templateParams.webpackConfig,
            settings: (templateParams.htmlWebpackPlugin.options.settings || {}),
        }, {
            filename: templateParams.htmlWebpackPlugin.options.template.replace(/^\.+\!/, '')
        });

        return result;
    };
    `;
};
