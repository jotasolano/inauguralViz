var gulp = require('gulp');

gulp.task('build', ['browserify', 'css', 'images', 'markup', 'fonts', 'assets']);
