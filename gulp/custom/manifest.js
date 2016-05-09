'use strict';

module.exports = function(gulp, plugins, config) {

    gulp.task('manifest', function() {
        gulp.src([config.destPublicPath + '**/*'])
            .pipe(plugins.manifest({
                network: ['*'],
                // fallback: ['fonts/fontawesome-webfont.eot fonts/fontawesome-webfont.eot',
                //     'fonts/fontawesome-webfont.svg fonts/fontawesome-webfont.svg',
                //     'fonts/fontawesome-webfont.ttf fonts/fontawesome-webfont.ttf',
                //     'fonts/fontawesome-webfont.woff fonts/fontawesome-webfont.woff',
                //     'fonts/fontawesome-webfont.woff2 fonts/fontawesome-webfont.woff2',
                //     'fonts/FontAwesome.otf fonts/FontAwesome.otf'
                // ],
                filename: 'manifest.appcache',
                exclude: 'manifest.appcache',
                timestamp: true
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    gulp.task('watch:manifest', function() {
        gulp.watch('public/**/*', ['manifest']);
    });
};
