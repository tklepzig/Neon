'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: '*',
    scope: ['dependencies', 'devDependencies']
});

var config = require('./gulp/config.js')(plugins);

//add all javascript files that are not bower main files (see '.bower.json' in the bower_components folder)
//all javascript from the lib-dir must not be included here (see var javaScriptFile - beware of file order!!)
  //config.srcVendorFiles.push(path.resolve(__dirname + '/public/bower_components/path/to/js'));

//add custom config values
  //config.answer = 42;
//or include custom config files (and extend the config by passing the existing config into the module)
  //config = require('./gulp/config-foo.js')(config);

//import all base tasks
require('./gulp/copyStatic.js')(gulp, plugins, config);
require('./gulp/index.js')(gulp, plugins, config);
require('./gulp/scripts.js')(gulp, plugins, config);
require('./gulp/styles.js')(gulp, plugins, config);
require('./gulp/webserver.js')(gulp, plugins, config);
require('./gulp/tests.js')(gulp, plugins, config);

//import custom tasks
require('./gulp/custom/build-run.js')(gulp, plugins, config);
require('./gulp/custom/watch-all.js')(gulp, plugins, config);
