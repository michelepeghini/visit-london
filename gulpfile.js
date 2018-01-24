var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer'),
clean = require('gulp-clean');

const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/*.js',
};

const APPAPTH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
};

gulp.task('scripts', ['clean-js'], function() {
    return gulp.src(SOURCEPATHS.jsSource)
      .pipe(gulp.dest(APPAPTH.js));
});

gulp.task('clean-js', function() {
  return gulp.src(APPAPTH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
});

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

gulp.task('copy', ['clean-html'], function() {
    return gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPAPTH.root));
});

gulp.task('clean-html', function() {
  return gulp.src(APPAPTH.root + '/*.html', {read: false, force: true})
    .pipe(clean());
});

gulp.task('watch', ['serve', 'sass', 'copy', 'scripts'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);

});

gulp.task('default', ['watch']);
