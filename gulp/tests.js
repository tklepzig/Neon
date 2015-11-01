'use strict';

module.exports = function(gulp, plugins, config) {
    gulp.task('karma', function(done) {
        plugins.karma.server.start({
            configFile: config.karmaConfigFile,
            singleRun: true
        }, done);
    });
};
