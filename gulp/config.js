'use strict';

var path = require('path');

module.exports = function(plugins) {

    //base variables
    var applicationName = 'neon';
    var srcPublicPath = 'public/';
    var destPath = 'dist/';
    var destPublicPath = destPath + 'public/';
    var destServerPath = destPath + 'server/';

    var config = {
        applicationName: applicationName,

        srcPublicPath: srcPublicPath,
        srcJsFiles: [srcPublicPath + 'lib/**/*.js',
            srcPublicPath + 'app/**/*.js',
            '!' + srcPublicPath + 'bower_components',
            '!' + srcPublicPath + 'app/**/*.spec.js'
        ],
        srcTemplateFiles: [srcPublicPath + 'app/**/*.html'],
        srcSassFiles: ['**/*.scss',
            '!' + srcPublicPath + 'bower_components'
        ],
        srcMainSassFile: srcPublicPath + 'assets/sass/main.scss',
        srcServerFiles: ['server/**/*.*', 'server/.gitignore'],


        destPath: destPath,
        destPublicPath: destPublicPath,
        destJsPath: destPublicPath + 'js/',
        destCssPath: destPublicPath + 'css/',
        destJsFile: applicationName + '.js',
        destVendorFile: 'vendor.js',
        destTemplateFile: applicationName + '-templates.js',
        destCombinedJsFile: applicationName + '.min.js',
        destCssFile: 'main.min.css',
        destServerPath: destServerPath,

        karmaConfigFile: path.resolve('karma.conf.js')
    };

    config.destJsFiles = [config.destJsPath + config.destVendorFile, config.destJsPath + config.destJsFile, config.destJsPath + config.destTemplateFile];

    //ensure that jQuery is included beofre angular
    config.srcVendorFiles = [srcPublicPath + 'bower_components/jquery/dist/jquery.min.js'].concat(plugins.mainBowerFiles().filter(function(file) {
        return file.indexOf('.js') > -1 && file.indexOf('jquery.js') === -1 && file.indexOf('.css') === -1;
    }));

    return config;
};
