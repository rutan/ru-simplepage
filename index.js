#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const colors = require('colors');

const paths = (() => {
    const root = __dirname;
    return {
        root,
        template: path.join(root, 'template')
    };
})();

const optionDefinitions = [
    {
        name: 'project',
        type: String,
        defaultOption: true
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean
    }
];
const options = commandLineArgs(optionDefinitions);

function showHelp() {
    const sections = [
        {
            header: 'ru-simplepage',
            content: '$ ru-simplepage [underline]{projectName}'
        }
    ];
    console.log(getUsage(sections));
}

if (options.help || !options.project) {
    showHelp();
    process.exit();
}

console.log();
try {
    const outputPath = path.join(process.cwd(), options.project);
    fse.copySync(paths.template, outputPath, {
        overwrite: false,
        errorOnExist: true
    });
    const packageJSONPath = path.join(outputPath, 'package.json');
    const packageJSON = fse.readJsonSync(packageJSONPath);
    packageJSON.name = options.project;
    fse.writeJsonSync(packageJSONPath, packageJSON, {spaces: 2});
    console.log(`(๑˃̵ᴗ˂̵)و '${options.project}' is a good project!`.green);
    console.log(`created ${outputPath}`.green);
} catch (e) {
    console.error('(◞‸◟) oh, failed...'.red);
    console.error(String(e).red);
}
console.log();

