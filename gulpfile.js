/* global require */

var gulp          = require('gulp');
var shell         = require('gulp-shell');
var minifyHtml    = require('gulp-htmlmin');
var autoprefixer  = require('gulp-autoprefixer');
var minifyCss     = require('gulp-clean-css');
var rename        = require('gulp-rename');
var concatCss     = require('gulp-concat-css');
var minifyImg     = require('gulp-imagemin');
var download      = require('gulp-download');

var htmlSource    = '_site/**/*.html';
var cssSource     = 'public/css/*.css';
var imgSource     = 'public/imgs/*';

var clean         = '~/repos/kripple.github.io/*';

var destination   = '../kripple.github.io/';
var htmlWrite     = destination;
var cssWrite      = destination + 'public/css/';
var imgWrite      = destination + 'public/imgs/';
var jsWrite       = destination + 'public/js/';

var devConfig     = '_config.yml';
var prodConfig    = '_config_prod.yml';

// todo:
// 1. optimize font & image loading
// 2. seo task


gulp.task('dev-build', function(done) {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      ( 'bundle exec jekyll build --config ' + devConfig )
  ]));
  done();
});

gulp.task('prod-build', function(done) {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      ( 'bundle exec jekyll build --config ' + prodConfig )
  ]));
  done();
});

gulp.task('html', function(done) {
  return gulp.src(htmlSource)
    .pipe(minifyHtml({
      collapseWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      removeComments: true
    }))
    .pipe(gulp.dest(htmlWrite));
  done();
});

gulp.task('css', function(done) {
  return gulp.src(cssSource)
    .pipe(autoprefixer())
    .pipe(concatCss(cssWrite))
    .pipe(rename('style.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(cssWrite));
  done();
});

gulp.task('images', function () {
  return gulp.src(imgSource)
    .pipe(minifyImg())
    .pipe(gulp.dest(imgWrite));
  done();
});

gulp.task('analytics', function(done) {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest(jsWrite));
  done();
});

gulp.task('clean', function(done) {
  return gulp.src(destination, { read: false })
    .pipe(shell([
      ( 'rm -r ' + clean )
  ]));
  done();
});

gulp.task('default', gulp.series('dev-build','html','css','images','analytics', function(done) {
  done();
}));

gulp.task('prod', gulp.series('prod-build','html','css','images','analytics', function(done) {
  done();
}));









 


