var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', function() {

});

gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      'jekyll build'
  ]));
});