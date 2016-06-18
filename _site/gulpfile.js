var gulp = require('gulp');
var shell = require('gulp-shell');
var minifyHTML = require('gulp-minify-html');

gulp.task('default', function() {

});

gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      'jekyll build'
  ]));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src('_site/**/*.html')
    .pipe(minifyHTML({
        quotes: true
    }))
    .pipe(gulp.dest('_site/'));
});