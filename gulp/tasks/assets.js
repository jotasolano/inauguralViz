var changed    = require('gulp-changed');
var gulp       = require('gulp');
var browserSync = require('browser-sync');

gulp.task('assets', function() {
  var dest = './build/assets';

  return gulp.src('./src/assets/**')
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream: true}));
});
