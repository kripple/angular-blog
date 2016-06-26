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
var request       = require('request');
var sitemap       = require('gulp-sitemap');
var eslint        = require('gulp-eslint');
var execSync      = require('child_process').execSync;

var htmlSource    = '_site/**/*.html';
var cssSource     = 'public/css/*.css';
var imgSource     = 'public/imgs/*';
var jsSource      = ['_site/**/*.js','!node_modules/**']; 

var clean         = '~/repos/kripple.github.io/*';

var destination   = '../kripple.github.io/';
var htmlWrite     = destination;
var cssWrite      = destination + 'public/css/';
var imgWrite      = destination + 'public/imgs/';
var jsWrite       = destination + 'public/js/';

var devConfig     = '_config.yml';
var prodConfig    = '_config_prod.yml';

var url           = 'http://kellyripple.com';

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

gulp.task('lint', function(done) {
  return gulp.src(jsSource)
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
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

gulp.task('seo', function(done) {
  gulp.src(htmlSource)
  .pipe(sitemap({
    siteUrl: url,
    verbose: true,
    lastmod: getDateTimeOfLatestCommit,
    getLoc: removeFileExtension
  }))
  .pipe(gulp.dest(htmlWrite));
  request('http://www.google.com/webmasters/tools/ping?sitemap={./sitemap.xml}');
  request('http://www.bing.com/webmaster/ping.aspx?siteMap={./sitemap.xml}');
  done();
});

gulp.task('default', gulp.series('dev-build', function(done) {
  done();
}));

gulp.task('prod', gulp.series('clean','prod-build','html','css','images','analytics','seo', function(done) {
  done();
}));

function getDateTimeOfLatestCommit(file) {
  var cmd = 'git log -1 --format=%cI "' + file.relative + '"';
  var buffer = execSync(cmd, {
      cwd: file.base
    });
  return buffer.toString().trim();
}

function removeFileExtension(siteUrl, loc, entry) {
  return loc.substr(0, loc.lastIndexOf('.')) || loc; 
}










 


