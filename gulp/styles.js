'use strict';
var beeper = require('beeper');

function onStyleError(err) {
  beeper();
  console.log(err);
}

module.exports = function(gulp, plugins, config) {
  // process sass file to css
  gulp.task('styles', function() {
    return gulp.src(config.srcMainSassFile)
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer({
        cascade: false
      }))
      .pipe(plugins.minifyCss({
        advanced: false
      }))
      .pipe(plugins.rename(config.destCssFile))
      .pipe(gulp.dest(config.destCssPath));
  });

  // process sass file to css without minify
  gulp.task('styles:dev', function() {
    return gulp.src(config.srcMainSassFile)
      .pipe(plugins.plumber({
        errorHandler: onStyleError
      }))
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer({
        cascade: false
      }))
      .pipe(plugins.rename(config.destCssFile))
      .pipe(gulp.dest(config.destCssPath));
  });

  /*----------watchers----------*/

  gulp.task('watch:styles', function() {
    gulp.watch(config.srcSassFiles, ['styles']);
  });
};
