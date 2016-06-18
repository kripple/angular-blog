var jekyllSourcePath = 'index.html';
var htmlSourcePath = '_site/**/*.html';
var htmlDestinationPath = '_site/';

var gulp = require('gulp');
var shell = require('gulp-shell');
var minifyHTML = require('gulp-minify-html');

gulp.task('default', function() {

});

gulp.task('jekyll', function() {
  return gulp.src(jekyllSourcePath, { read: false })
    .pipe(shell([
      'jekyll build'
  ]));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src(htmlSourcePath)
    .pipe(minifyHTML({
        quotes: true
    }))
    .pipe(gulp.dest(htmlDestinationPath));
});


