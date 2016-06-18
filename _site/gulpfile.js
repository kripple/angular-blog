var gulp = require('gulp');
var shell = require('gulp-shell');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var minifyHtml = require('gulp-minify-html');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');
var uncss = require('gulp-uncss');
var minifyCss = require('gulp-clean-css');
var minifyImg = require('gulp-imagemin');
var download = require('gulp-download');
var eslint = require('gulp-eslint');
var changed = require('gulp-changed');

var jekyllSourcePath = 'index.html';
var htmlSource = '_site/**/*.html';
var htmlPath = '_site/';
var minHtmlPath = 'main.min.html';
var cssSource = '@(public|projects)/**/*.css';
var cssPath = '_site/public/css/';
var cssBundlePath = '_site/public/css/bundle.css';
var minCssPath = 'style.min.css';
var jsSource = '@(public|projects)/**/*.js';
var jsPath = '_site/public/js/';
var jsSourcePath = 'public/js/';
var imgSource = 'public/imgs/**/*';
var imgPath = '_site/';


gulp.task('default', ['jekyll','html','css','images','analytics']);


gulp.task('jekyll', function() {
  return gulp.src(jekyllSourcePath, { read: false })
  	.pipe(debug({title: 'jekyll build:'}))
    .pipe(shell([
      'jekyll build'
  ]));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src(htmlSource)
  	// .pipe(debug({title: 'html optimization: '}))
  	.pipe(changed(htmlPath))
  	.pipe(sourcemaps.init())
    .pipe(minifyHtml({
        quotes: true
    }))
    .pipe(rename(minHtmlPath))
		.pipe(sourcemaps.write())
    .pipe(gulp.dest(htmlPath));
});

gulp.task('css', ['jekyll'], function() {
  return gulp.src(cssSource)
		// .pipe(debug({title: 'css optimization:',minimal:false}))
		.pipe(changed(cssPath))
		.pipe(sourcemaps.init())
		.pipe(uncss({html:htmlSource}))
		.pipe(autoprefixer())
		.pipe(concatCss(cssBundlePath))
		.pipe(minifyCss({keepBreaks:false}))
		.pipe(rename(minCssPath))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(cssPath));
});

gulp.task('images', ['jekyll'], function () {
  return gulp.src(imgSource)
    // .pipe(debug({title: 'image optimization:',minimal:false}))
    .pipe(changed(imgPath))
  	.pipe(sourcemaps.init())
    .pipe(minifyImg())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(imgPath));
});

gulp.task('analytics', ['jekyll'], function() {
  return download('https://www.google-analytics.com/analytics.js')
		// .pipe(debug({title: 'Retreive newest analytics:',minimal:false}))
    .pipe(gulp.dest(jsPath));
});

// // JS - add browserfy & uglify
// gulp.task('js', function () {
//   return gulp.src(jsSource)
//   	.pipe(debug({title: 'js optimization:',minimal:false}))
//   	.pipe(sourcemaps.init())
//     .pipe(gulp.dest(jsPath));
// });

gulp.task('lint', function () {
  return gulp.src(jsSource)
  	// .pipe(debug({title: 'Lint JS:',minimal:false}))
  	.pipe(changed(jsSourcePath))
    .pipe(eslint())
    // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch(jsSource, ['lint']);
});

// RSync

// SEO

// Caching ???

