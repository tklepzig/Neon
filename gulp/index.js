'use strict';

module.exports = function(gulp, plugins, config) {

    // copy index.html and inject concated js dist file
    gulp.task('index', function() {
        return gulp.src(config.srcPublicPath + 'index.html')
            .pipe(plugins.inject(gulp.src([config.destJsPath + config.destCombinedJsFile, config.destCssPath + config.destCssFile], {
                read: false
            }), {
              ignorePath:'/dist/public',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    // copy index.html and inject js dist files
    gulp.task('index:dev', function() {
        return gulp.src(config.srcPublicPath + 'index.html')
            .pipe(plugins.inject(gulp.src(config.destJsFiles.concat([config.destCssPath + config.destCssFile]), {
                read: false
            }), {
              ignorePath:'/dist/public',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    gulp.task('app.html', function() {
        return gulp.src(config.srcPublicPath + 'app.html')
            .pipe(gulp.dest(config.destPublicPath));
    });


    /*----------watchers----------*/

    gulp.task('watch:index', function() {
        gulp.watch(config.srcPublicPath + 'index.html', ['index:dev']);
    });
};
