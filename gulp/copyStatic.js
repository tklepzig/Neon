'use strict';

module.exports = function(gulp, plugins, config) {

    // copy content to dist
    gulp.task('copyStatic:content', function() {
        return gulp.src([config.srcPublicPath + 'assets/**/*.*', '!' + config.srcPublicPath + 'assets/sass/**/*.*'])
            .pipe(gulp.dest(config.destPublicPath + 'content'));
    });

    // copy locales to dist
    gulp.task('copyStatic:locales', function() {
        return gulp.src(config.srcPublicPath + 'locales/**/*.*')
            .pipe(gulp.dest(config.destPublicPath + 'locales'));
    });

    // copy fonts from all bower_components to dist
    gulp.task('copyStatic:fonts', function() {
        return gulp.src(config.srcPublicPath + 'bower_components/**/fonts/*.*')
            .pipe(gulp.dest(config.destPublicPath + 'fonts'));
    });

    gulp.task('copyStatic:package.json', function() {
        return gulp.src('package.json')
            .pipe(gulp.dest(config.destPath));
    });

    gulp.task('copyStatic:web.config', function() {
        return gulp.src('web.config')
            .pipe(gulp.dest(config.destPath));
    });

    gulp.task('copyStatic:favicon', function() {
        return gulp.src(config.srcPublicPath + 'favicon.ico', config.srcPublicPath + 'favicon.png')
            .pipe(gulp.dest(config.destPublicPath));
    });

    gulp.task('copyStatic:manifest', function() {
        return gulp.src(config.srcPublicPath + 'manifest.json')
            .pipe(gulp.dest(config.destPublicPath));
    });

    // copy static files to dist
    gulp.task('copyStatic', ['copyStatic:content', 'copyStatic:locales', 'copyStatic:fonts', 'copyStatic:web.config', 'copyStatic:package.json', 'copyStatic:favicon']);

    /*----------watchers----------*/

    gulp.task('watch:content', function() {
        gulp.watch(config.srcPublicPath + 'assets/**/*.*', ['copyStatic:content']);
    });

    gulp.task('watch:locales', function() {
        gulp.watch(config.srcPublicPath + 'locales/**/*.json', ['copyStatic:locales']);
    });

    gulp.task('watch:fonts', function() {
        gulp.watch(config.srcPublicPath + 'bower_components/**/fonts/*.*', ['copyStatic:fonts']);
    });


    gulp.task('watch:copyStatic', ['watch:content', 'watch:locales', 'watch:fonts']);

};
