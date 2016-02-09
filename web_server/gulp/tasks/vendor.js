var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');

var config  = require('../config.js');
var libs    = config.libs;
var paths   = config.paths;


module.exports = function(gulp) {

  return function() {
    
    var b = browserify();

    libs.forEach(function(lib){
      b.require(lib);
    });

    return b.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulp.dest(paths.js.dest));
  }
};