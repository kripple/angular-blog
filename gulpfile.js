var gulp = require('gulp');
var shell = require('gulp-shell');
var minifyHtml = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var minifyImg = require('gulp-imagemin');
var download = require('gulp-download');

var originPath = '_site/';
var destinationPath = '../blog-src/';

var htmlSource = '_site/**/*.html';
var cssSource = 'public/**/*.css';
var imgSource = 'public/imgs/**/*';

var htmlReadPath = originPath;
var cssReadPath = originPath + 'public/css/';
var imgReadPath = originPath +'public/imgs/';

var htmlWritePath = destinationPath;
var cssWritePath = destinationPath + 'public/css/';
var imgWritePath = destinationPath + 'public/imgs/';
var jsWritePath = destinationPath + 'public/js/'


gulp.task('default', ['jekyll','html','css','images','analytics']);


gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      'jekyll build'
  ]));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src(htmlSource)
    .pipe(minifyHtml({
      collapseWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      removeComments: true
    }))
    .pipe(gulp.dest(htmlWritePath));
});

gulp.task('css', ['jekyll'], function() {
  return gulp.src(cssSource)
    .pipe(autoprefixer())
    .pipe(concatCss(cssWritePath))
    .pipe(rename('style.min.css'))
    .pipe(minifyCss({keepBreaks:false}))
    .pipe(gulp.dest(cssWritePath));
});

gulp.task('images', ['jekyll'], function () {
  return gulp.src(imgSource)
    .pipe(minifyImg())
    .pipe(gulp.dest(imgWritePath));
});

gulp.task('analytics', ['jekyll'], function() {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest(jsWritePath));
});



 


