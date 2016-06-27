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
var gutil          = require('gulp-util');

var htmlSource    = '_site/**/*.html';
var cssSource     = 'public/css/*.css';
var imgSource     = 'public/imgs/*';
var jsSource      = ['_site/**/*.js','!node_modules/**','./gulpfile.js']; 

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
// 2. git checkout --orphan <branch_name> (not sure if src is main or orphan)
// 3. complete transition to Lanyon


gulp.task('dev-build', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      ( 'jekyll build --config ' + devConfig )
  ]));
});

gulp.task('prod-build', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      ( 'jekyll build --config ' + prodConfig )
  ]));
});

gulp.task('html', function() {
  return gulp.src(htmlSource)
    .pipe(minifyHtml({
      collapseWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      removeComments: true
    }))
    .pipe(gulp.dest(htmlWrite));
});

gulp.task('css', function() {
  return gulp.src(cssSource)
    .pipe(autoprefixer())
    .pipe(concatCss(cssWrite))
    .pipe(rename('style.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(cssWrite));
});

gulp.task('lint', function() {
  return gulp.src(jsSource)
    .pipe(eslint({
      'globals': {
        'require': true
      }
    }))
    .pipe(eslint.formatEach())
    .pipe(eslint.result(function (result) {
      if((result.warningCount+result.errorCount) === 0) {
        gutil.log('lint completed with no errors');
      }
    }));
});

gulp.task('watch', function() {
  gulp.watch(jsSource, gulp.series('lint', function(done) {
    done();
  })
)});

gulp.task('images', function () {
  return gulp.src(imgSource)
    .pipe(minifyImg())
    .pipe(gulp.dest(imgWrite));
});

gulp.task('analytics', function() {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest(jsWrite));
});

gulp.task('clean', function() {
  return gulp.src(destination, { read: false })
    .pipe(shell([
      ( 'rm -r ' + clean )
  ]));
});

gulp.task('sitemap', function() {
  return gulp.src(htmlSource)
    .pipe(sitemap({
      siteUrl: url,
      verbose: true,
      lastmod: getDateTimeOfLatestCommit,
      getLoc: removeFileExtension
    }))
    .pipe(gulp.dest(htmlWrite));
});

gulp.task('seo', function(done) {
  request('http://www.google.com/webmasters/tools/ping?sitemap={./sitemap.xml}');
  request('http://www.bing.com/webmaster/ping.aspx?siteMap={./sitemap.xml}');
  done();
});

gulp.task('default', gulp.series('dev-build', function(done) {
  done();
}));

gulp.task('prod', gulp.series('clean','prod-build','html','css','images','analytics','sitemap','seo', function(done) {
  done();
}));

function getDateTimeOfLatestCommit(file) {
  var cmd = 'git log -1 --format=%cI "' + file.relative + '"';
  var buffer = execSync(cmd, {
      cwd: file.base
    });
  return buffer.toString().trim();
}

function removeFileExtension(siteUrl, loc) {
  return loc.substr(0, loc.lastIndexOf('.')) || loc; 
}










 


