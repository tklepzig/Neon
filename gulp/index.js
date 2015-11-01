'use strict';

module.exports = function(gulp, plugins, config) {

    // copy index.html and inject concated js dist file
    gulp.task('index', function() {
        return gulp.src(config.srcPublicPath + 'index.html')
            .pipe(plugins.inject(gulp.src([config.destJsPath + config.destCombinedJsFile, config.destCssPath + config.destCssFile], {
                read: false
            }), {
              ignorePath:'/dist/',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPath));
    });

    // copy index.html and inject js dist files
    gulp.task('index:dev', function() {
        return gulp.src(config.srcPublicPath + 'index.html')
            .pipe(plugins.inject(gulp.src(config.destJsFiles.concat([config.destCssPath + config.destCssFile]), {
                read: false
            }), {
              ignorePath:'/dist/',
              addRootSlash: false
            }))
            .pipe(gulp.dest(config.destPath));
    });


    /*----------watchers----------*/

    gulp.task('watch:index', function() {
        gulp.watch(config.srcPublicPath + 'index.html', ['index:dev']);
    });
};
