var browserify  = require('browserify');

// What is the purpose of this? ? 
var ractivate   = require('ractivate');
var babelify    = require('babelify');
var buffer      = require('vinyl-buffer');
var gutil       = require('gulp-util');

// vinyl-source-stream converts browserify bundle stream into gulp friendly stream.
var source      = require('vinyl-source-stream');

// Utility for wrapping non-stream plugins.
var streamify   = require('gulp-streamify');

var environment = gutil.env.env ? gutil.env.env : 'dev';
var config      = require('../config.js');
var libs        = config.libs;
var paths       = config.paths;

module.exports = function(gulp) {

  return function() {

    var b = browserify({
      debug: true
    });

    // external prevents the file from being loaded into the current bundle.
    libs.forEach(function(lib) {
      b.external(lib)
    });

    b.add(paths.js.src);
    b.require('./config-' + environment + '.es6', {expose: 'configuration'});
    b.transform({extensions: ['.ract']}, ractivate);
    b.transform({extensions: ['.es6']}, babelify);

    return b.bundle()
      .on('error', gutil.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest(paths.js.dest));
  }
};