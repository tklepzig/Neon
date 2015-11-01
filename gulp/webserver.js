'use strict';

module.exports = function(gulp, plugins, config) {

    //webserver for serving static content
    gulp.task('webserver', function() {
        gulp.src('dist')
            .pipe(plugins.webserver({
                livereload: true,
                open: true,
                fallback: 'index.html'
            }));
    });

};
