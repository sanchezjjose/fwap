var gulp  = require('gulp');
var jshint  = require('gulp-jshint');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var BASE = './public/js/whatsgood.js';
var BASE_MINIFIED = 'whatsgood.min.js';
var DEST_DIR = './public/js/';


gulp.task('uglify-js', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(BASE)
    .pipe(browserified)
    .pipe(uglify())
    .pipe(rename(BASE_MINIFIED))
    .pipe(gulp.dest(DEST_DIR));
});

gulp.task('ubar-js', ['uglify-js']);