var gulp  = require('gulp');

var UBAR_DIR = 'ubar';
var SOURCE_FILES = './node_modules/ubar/templates/' + UBAR_DIR + '/*';
var DEST_DIR = './public/templates/' + UBAR_DIR + '/';

gulp.task('ubar-templates', function() {
  return gulp.src(SOURCE_FILES)
          .pipe(gulp.dest(DEST_DIR));
});