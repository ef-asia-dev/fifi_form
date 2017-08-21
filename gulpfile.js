const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const argv = require('minimist')(process.argv.slice(2));
const config = {
  minify: argv.m || argv.minify || false,
  env: argv.e || argv.environment || 'dev'
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  let stream = gulp.src(['src/scss/reset.scss',
                         'src/scss/*.scss'])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(sass().on('error', sass.logError))
                   .pipe(gulp.dest('dist/styles/'));

  //if (config.minify) stream =
  stream = stream.pipe(cleanCSS())
                 .pipe(concat('main.css'));

  return stream.pipe(gulp.dest('dist/styles/'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function(){
  let stream = gulp.src('src/js/*.js')
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(concat('main.js'))
                   .pipe(babel({
                     presets: ['es2015']
                   }))
                   .pipe(gulp.dest('dist/scripts/'));

  if (config.minify) stream = stream.pipe(rename({suffix: '.min'})).pipe(uglify());

  return stream.pipe(gulp.dest('dist/scripts/'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('formjs', function(){
  let stream = gulp.src(['src/fifi_form/firstline.js',
                         'src/fifi_form/defaults.js',
                         'src/fifi_form/*.js'])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(concat('form_master.js'))
                   .pipe(babel({
                     presets: ['es2015']
                   }))
                   .pipe(gulp.dest('dist/scripts/fifi_form/'));

  if (config.minify) stream = stream.pipe(rename({suffix: '.min'})).pipe(uglify());

  return stream.pipe(gulp.dest('dist/scripts/fifi_form/'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('nonEFform', function(){
  let stream = gulp.src(['src/fifi_form_nonEF/firstline.js',
                         'src/fifi_form_nonEF/defaults.js',
                         'src/fifi_form_nonEF/*.js'])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(concat('form_master_nonEF.js'))
                   .pipe(babel({
                     presets: ['es2015']
                   }))
                   .pipe(gulp.dest('dist/scripts/fifi_form/'));

  if (config.minify) stream = stream.pipe(rename({suffix: '.min'})).pipe(uglify());

  return stream.pipe(gulp.dest('dist/scripts/fifi_form/'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('slider', function(){
  let stream = gulp.src(['src/fifi_slider/defaults.js',
                         'src/fifi_slider/*.js'])
                   .pipe(plumber({
                     errorHandler: function (error) {
                       console.log(error.message);
                       this.emit('end');
                   }}))
                   .pipe(concat('fifi_slider.js'))
                   .pipe(babel({
                     presets: ['es2015']
                   }))
                   .pipe(gulp.dest('dist/scripts/'));

  if (config.minify) stream = stream.pipe(rename({suffix: '.min'})).pipe(uglify());

  return stream.pipe(gulp.dest('dist/scripts/'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('help', function() {
  console.log('*** Gulp Commands ***');
  console.log('$ gulp // watch .scss, .js & .html; reload browser');
  console.log('$ gulp images // compress images');
  console.log('$ gulp styles --minify *OR* $ gulp styles --m // compile & minify .scss');
  console.log('$ gulp scripts --minify *OR* $ gulp scripts --m  // compile & minify .js');
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/scss/*.scss", ['styles']);
  gulp.watch("src/fifi_form/*.js", ['formjs']);
  gulp.watch("src/fifi_slider/*.js", ['slider']);
  gulp.watch("src/js/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});
