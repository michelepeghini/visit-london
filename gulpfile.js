var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer'),
clean = require('gulp-clean'),
concat = require('gulp-concat'),
browserify = require('gulp-browserify'),
merge = require('merge-stream'),
newer = require('gulp-newer'),
imagemin = require('gulp-imagemin'),
injectPartials = require('gulp-inject-partials'),
minify = require('gulp-minify'),
cssmin = require('gulp-cssmin'),
rename = require('gulp-rename'),
htmlmin = require('gulp-htmlmin');


const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource: 'src/js/*.js',
  imgSource: 'src/img/**'
};
const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
};


/* JS */

gulp.task('scripts', ['clean-js'], function() {
    return gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATH.js));
});

gulp.task('clean-js', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
});


/* IMAGES */

gulp.task('images', ['clean-images'], function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});

gulp.task('clean-images', function() {
  return gulp.src(APPPATH.img + '/*.jpg', {read: false, force: true})
    .pipe(clean());
});


/* CSS */
gulp.task('serve', ['compresscss'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  });
});

gulp.task('moveFonts', function(){
  return gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(APPPATH.fonts));
});


/* HTML */

gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
    .pipe(clean());
});

gulp.task('html', ['clean-html'], function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATH.root));
});

/* PRODUCTION TASKS */

gulp.task('minifyHtml', function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(APPPATH.root));
});

gulp.task('compresscss', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

    return merge(bootstrapCSS, sassFiles)
      .pipe(concat('app.css'))
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(APPPATH.css));
});

gulp.task('minify',  function() {
    return gulp.src(SOURCEPATHS.jsSource)
      .pipe(concat('main.js'))
      .pipe(browserify())
      .pipe(minify())
      .pipe(gulp.dest(APPPATH.js));
});

/* END PRODUCTION TASKS */

/* WATCH */
gulp.task('watch', ['moveFonts', 'images', 'serve', 'html', 'scripts'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['compresscss']);
  //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], 'html');
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.imgSource], ['images']);

});

gulp.task('production', ['minify', 'minifyHtml', 'compresscss']);
gulp.task('default', ['watch']);
