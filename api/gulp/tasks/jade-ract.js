var jade    = require('gulp-jade');
var rename  = require('gulp-rename');
var config  = require('../config.js');
var paths   = config.paths;

module.exports = function(gulp) {

  return function() {
    return gulp.src(paths.jade.src)
      .pipe(jade({pretty:true}))
      .pipe(rename(function(path){
        path.extname = '.ract';
      }))
      .pipe(gulp.dest(paths.jade.dest));
  };
};