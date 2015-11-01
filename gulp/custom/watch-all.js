'use strict';

module.exports = function(gulp, plugins, config) {

    // start all watchers
    gulp.task('watch:all', ['watch:styles', 'watch:scripts', 'watch:index', 'watch:copyStatic']);
};
