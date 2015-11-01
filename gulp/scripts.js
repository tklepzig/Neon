'use strict';

var del = require('del');
var vinylPath = require('vinyl-paths');

module.exports = function(gulp, plugins, config) {
    var bowerVersion = require('../bower.json').version;
    var currentDate = new Date();
    var banner = ['/**',
        ' * Build Time: <%= buildTime %> - Version: <%= version %> ',
        ' */',
        'var BUILD = {',
        '   TIME: \"<%= buildTime %>\",',
        '   VERSION: \"<%= version %>\"',
        '};',
        ''
    ].join('\n');

    // concat js files (excluding spec files and properties.js)
    gulp.task('package:js', function() {
        return gulp.src(config.srcJsFiles)
            .pipe(plugins.concat(config.destJsFile))
            .pipe(plugins.removeUseStrict())
            .pipe(plugins.header(banner, {
                buildTime: currentDate,
                version: bowerVersion
            }))
            .pipe(gulp.dest(config.destJsPath));
    });

    // uglify js files
    gulp.task('uglify:js', ['package:js'], function() {
        return gulp.src(config.destJsPath + config.destJsFile)
            .pipe(plugins.ngAnnotate())
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.destJsPath));
    });

    // concat and uglify vendor files
    gulp.task('package:vendor', function() {
        return gulp.src(config.srcVendorFiles)
            .pipe(plugins.concat(config.destVendorFile))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.destJsPath));
    });

    // package templates to js file
    gulp.task('package:templates', function() {
        return gulp.src(config.srcTemplateFiles)
            .pipe(plugins.html2js({
                outputModuleName: config.applicationName,
                base: config.srcPublicPath
            }))
            .pipe(plugins.concat(config.destTemplateFile))
            .pipe(gulp.dest(config.destJsPath));
    });

    gulp.task('uglify:templates', function() {
        return gulp.src(config.srcTemplateFiles)
            .pipe(plugins.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(plugins.html2js({
                outputModuleName: config.applicationName,
                base: config.srcPublicPath
            }))
            .pipe(plugins.concat(config.destTemplateFile))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.destJsPath));
    });

    // combines all dist script files to single file
    gulp.task('combineDistJsFiles', function() {
        return gulp.src(config.destJsFiles)
            .pipe(vinylPath(del))
            .pipe(plugins.concat(config.destCombinedJsFile))
            .pipe(gulp.dest(config.destJsPath));
    });

    // lint
    gulp.task('lint', function() {
        return gulp.src(config.srcJsFiles)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish'));
    });


    // process all scripts
    gulp.task('scripts', function(done) {
        plugins.runSequence(['package:vendor', 'uglify:js', 'uglify:templates', 'lint'], 'combineDistJsFiles', done);
    });

    // process all scripts without uglify (for dev)
    gulp.task('scripts:dev', ['package:vendor', 'package:js', 'package:templates', 'lint']);



    /*----------watchers----------*/

    gulp.task('watch:js', function() {
        gulp.watch(config.srcJsFiles, ['lint', 'package:js']);
    });

    gulp.task('watch:vendor', function() {
        gulp.watch(config.srcVendorFiles, ['package:vendor']);
    });

    gulp.task('watch:templates', function() {
        gulp.watch(config.srcTemplateFiles, ['package:templates']);
    });


    gulp.task('watch:scripts', ['watch:js', 'watch:vendor', 'watch:templates']);

};
