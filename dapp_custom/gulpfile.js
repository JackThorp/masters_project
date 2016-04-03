var serve = require('gulp-serve');
var gulp  = require('./gulp')([
    'browserify',
    'html'
]);


gulp.task('build', ['browserify', 'html']);

gulp.task('serve', ['build'], serve({
  root: ['dist'],
  port: 3000
}));

gulp.task('watch', ['build'], function() {
  gulp.watch('./src/index.html', ['html']);
  gulp.watch('./src/**/*.js', ['browserify']);
});

gulp.task('default', ['watch', 'serve']);

gulp.task('serve-dapp', serve({
  root: [''],
  port: 3000
}));
