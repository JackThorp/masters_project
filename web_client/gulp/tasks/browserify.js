var browserify = require('browserify');
var gutil = require('gulp-util');

// converts browserify bundle stream into gulp friendly stream.
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// Set environment variables as command line options to gulp
var env = gutil.env.env ? gutil.env.env : 'dev';

module.exports = function(gulp) {

  return function() {

    var b = browserify({debug: true});

    b.add('./src/js/app.js');

    // require allows you to provide a specific file when exposed require is called. 
    b.require('./config-'+env+'.js', {expose: 'configuration'});                          

    return b.bundle()
      .on('error', gutil.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./dist/js/'));
  }
};

