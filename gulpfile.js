const { src, dest, task, series, watch, parallel} = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
// const {SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS} = require('./gulp.config');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

sass.compiler = require('node-sass');

task('clean', () => {
  console.log(env);
    return src('dist/**/*', { read: false }).pipe(rm());
  });

task("copy:html", () => {
    return src('src/*.html')
      .pipe(dest('dist'))
      .pipe(reload({stream: true}));
});

task("copy:img", () => {
  return src('src/img/**/*.+(png|jpg|jpeg)')
    .pipe(dest('dist/images/img'))
    .pipe(reload({stream: true}));
});

task("fonts", () => {
  return src('src/fonts/**/*')
  .pipe(dest('dist/fonts'))
});

task("svg", () => {
  return src('src/img/sprite/*.svg')
  .pipe(dest('dist/sprite'))
});
task("svgIcon", () => {
  return src('src/img/icons/*.svg')
  .pipe(dest('dist/images/icon'))
});

const styles = [
  'node_modules/normalize.css/normalize.css',
  'src/scss/main.scss'
];

task('styles', () => {
    return src(styles)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    // .pipe(px2rem())
    .pipe(gulpif(env === 'prod', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
})

const libs = [
  'node_modules/jquery/dist/jquery.js',
  'src/js/*.js'
 ];

task('script', () => {
  return src(libs)
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
  .pipe(concat('main.min.js', { newLine: ';' }))
  .pipe(gulpif(env === 'prod', babel({
    presets: ['@babel/env']
  })))
  .pipe(gulpif(env === 'prod', uglify()))
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  .pipe(dest('dist'))
  .pipe(reload({ stream: true }));
})

task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: true
    });
});

task('watch', () => {
  watch('src/scss/**/*.scss', series('styles'));
  watch('src/**/*.html', series('copy:html'));
  watch('src/js/*.js', series('script'));
 });
  
  
 task('default',
  series(
    'clean', 
    parallel('copy:html', 'copy:img', 'fonts', "svg", 'svgIcon', 'styles', 'script'),
    parallel('watch', 'server')
  )
 );
 task('build',
  series(
    'clean',
    parallel('copy:html', 'copy:img', 'fonts', "svg", 'svgIcon', 'styles', 'script',))
 );
