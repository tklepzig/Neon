// Karma configuration
// Generated on Wed Mar 05 2014 11:19:14 GMT+0100 (CET)

'use strict';

module.exports = function(config)
{
    config.set(
    {

        // base path, that will be used to resolve files and exclude
        //basePath: 'public',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/bower_components/angular/angular.js',
            'public/bower_components/angular-route/angular-route.js',
            'public/bower_components/angular-mocks/angular-mocks.js',
            'public/app/**/*.js',
            'public/app/**/*.html'
        ],

        // preprocessors for files
        preprocessors:
        {
            'public/app/**/!(*spec)*.js': 'coverage',
            'public/app/**/*.html': 'ng-html2js'
        },

        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'junit', 'coverage'],

        // configure coverage reporter
        coverageReporter:
        {
            reporters: [
            {
                type: 'html',
                dir: 'coverage/'
            },
            {
                type: 'cobertura'
            }]
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
