'use strict';

module.exports = function(gulp, plugins, config) {

    // copy app.html and inject concated js dist file
    gulp.task('index', function() {
        return gulp.src(config.srcPublicPath + 'app.html')
            .pipe(plugins.inject(gulp.src([config.destJsPath + config.destCombinedJsFile, config.destCssPath + config.destCssFile], {
                read: false
            }), {
              ignorePath:'/dist/public',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    // copy app.html and inject js dist files
    gulp.task('index:dev', function() {
        return gulp.src(config.srcPublicPath + 'app.html')
            .pipe(plugins.inject(gulp.src(config.destJsFiles.concat([config.destCssPath + config.destCssFile]), {
                read: false
            }), {
              ignorePath:'/dist/public',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    gulp.task('entry-page', function() {
        return gulp.src(config.srcPublicPath + 'index.html')
            .pipe(gulp.dest(config.destPublicPath));
    });


    /*----------watchers----------*/

    gulp.task('watch:index', function() {
        gulp.watch(config.srcPublicPath + 'app.html', ['index:dev']);
    });
};
