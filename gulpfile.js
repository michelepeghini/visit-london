var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html'
};

const APPAPTH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
};

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPAPTH.css + '/*.css', APPAPTH.root + '/*.html', APPAPTH.js + '/*.js'], {
    server: {
      baseDir: APPAPTH.root
    }
  });
});

gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(APPAPTH.css));
});

gulp.task('copy', function() {
    return gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPAPTH.root));
});

gulp.task('watch', ['serve', 'sass', 'copy'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);

});

gulp.task('default', ['watch']);
