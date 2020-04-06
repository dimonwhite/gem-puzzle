const gulp = require('gulp');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('sass', () => gulp.src('./dev/scss/**/*.scss')
  .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
  .pipe(gulp.dest('./assets/css')));

gulp.task('watch', () => {
  gulp.watch('./dev/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
  'sass',
  'watch',
));
