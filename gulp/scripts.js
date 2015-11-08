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

    gulp.task('vendor', function() {
        return gulp.src(config.srcVendorFiles)
            .pipe(plugins.concat(config.destVendorFile))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.destJsPath));
    });


    gulp.task('js', function() {
        return gulp.src(config.srcJsFiles)
            .pipe(plugins.concat(config.destJsFile))
            .pipe(plugins.removeUseStrict())
            .pipe(plugins.header(banner, {
                buildTime: currentDate,
                version: bowerVersion
            }))
            .pipe(plugins.ngAnnotate())
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.destJsPath));
    });
    gulp.task('js:dev', function() {
        return gulp.src(config.srcJsFiles)
            .pipe(plugins.concat(config.destJsFile))
            .pipe(plugins.removeUseStrict())
            .pipe(plugins.header(banner, {
                buildTime: currentDate,
                version: bowerVersion
            }))
            .pipe(gulp.dest(config.destJsPath));
    });


    gulp.task('templates', function() {
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
    gulp.task('templates:dev', function() {
        return gulp.src(config.srcTemplateFiles)
            .pipe(plugins.html2js({
                outputModuleName: config.applicationName,
                base: config.srcPublicPath
            }))
            .pipe(plugins.concat(config.destTemplateFile))
            .pipe(gulp.dest(config.destJsPath));
    });


    gulp.task('combineDistJsFiles', function() {
        return gulp.src(config.destJsFiles)
            .pipe(vinylPath(del))
            .pipe(plugins.concat(config.destCombinedJsFile))
            .pipe(gulp.dest(config.destJsPath));
    });


    gulp.task('lint', function() {
        return gulp.src(config.srcJsFiles)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish'));
    });


    gulp.task('scripts', function(done) {
        plugins.runSequence(['vendor', 'js', 'templates', 'lint'], 'combineDistJsFiles', done);
    });

    gulp.task('scripts:dev', ['vendor', 'js:dev', 'templates:dev', 'lint']);



    /*----------watchers----------*/

    gulp.task('watch:js', function() {
        gulp.watch(config.srcJsFiles, ['lint', 'js:dev']);
    });

    gulp.task('watch:vendor', function() {
        gulp.watch(config.srcVendorFiles, ['vendor']);
    });

    gulp.task('watch:templates', function() {
        gulp.watch(config.srcTemplateFiles, ['templates:dev']);
    });


    gulp.task('watch:scripts', ['watch:js', 'watch:vendor', 'watch:templates']);

};
