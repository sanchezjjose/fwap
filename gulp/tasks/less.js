var gulp  = require('gulp');
var less  = require('gulp-less');

var UBAR_DIR = 'ubar';
var BASE = './node_modules/ubar/css/' + UBAR_DIR + '/ubar.less';
var DEST_DIR = './public/css/' + UBAR_DIR + '/';

gulp.task('ubar-less', function() {
  return gulp.src(BASE)
          .pipe(less())
          .pipe(gulp.dest(DEST_DIR));
});