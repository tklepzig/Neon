'use strict';

module.exports = function(gulp, plugins, config) {

    gulp.task('copy-server', function() {
        return gulp.src(config.srcServerFiles)
            .pipe(gulp.dest(config.destServerPath));
    });

    gulp.task('start-server', function() {
        plugins.nodemon({
            script: config.destServerPath + 'index.js',
            env: {
                'NODE_ENV': 'development'
            },
            ignore: ['neon-data/**/*']
        });
    });

    gulp.task('server', function(done) {
        plugins.runSequence('copy-server', 'start-server', done);
    });


    /*----------watchers----------*/

    gulp.task('watch:server', function() {
        gulp.watch(config.srcServerFiles, ['copy-server']);
    });
};
