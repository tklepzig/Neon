'use strict';

module.exports = function(gulp, plugins, config) {

    gulp.task('manifest', function() {
        gulp.src([config.destPublicPath + '**/*'])
            .pipe(plugins.manifest({
                exclude: ['manifest.appcache',
                    'index.html',
                    'fonts/material-design-icons-iconfont/dist/fonts/iconjar-map.js',
                    'fonts/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.ijmap',
                    'fonts/material-design-icons-iconfont/dist/fonts/README.md'
                ],
                network: ['*'],
                // fallback: ['fonts/fontawesome-webfont.eot fonts/fontawesome-webfont.eot',
                //     'fonts/fontawesome-webfont.svg fonts/fontawesome-webfont.svg',
                //     'fonts/fontawesome-webfont.ttf fonts/fontawesome-webfont.ttf',
                //     'fonts/fontawesome-webfont.woff fonts/fontawesome-webfont.woff',
                //     'fonts/fontawesome-webfont.woff2 fonts/fontawesome-webfont.woff2',
                //     'fonts/FontAwesome.otf fonts/FontAwesome.otf'
                // ],
                filename: 'manifest.appcache',
                timestamp: true
            }))
            .pipe(gulp.dest(config.destPublicPath));
    });

    gulp.task('watch:manifest', function() {
        gulp.watch('public/**/*', ['manifest']);
    });
};
