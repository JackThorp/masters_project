'use strict';

var gulp  = require('./gulp')([
    'vendor',
    'jade-ract'
]);


gulp.task('build-all', ['jade-ract', 'vendor']);
