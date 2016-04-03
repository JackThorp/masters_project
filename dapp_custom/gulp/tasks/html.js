module.exports = function(gulp) {

  return function() {
    return gulp.src('./src/index.html')
      .pipe(gulp.dest('./dist/'));
  };
};
