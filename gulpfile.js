import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import { create as bsCreate } from 'browser-sync';
import cleanCss from 'gulp-clean-css';
import clean from 'gulp-clean';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import minifyjs from 'gulp-js-minify';
import browserslist from 'browserslist';

// const cleanDist = () => {
//     return gulp.src('./dist', {read: false})
//         .pipe(clean());
// }

const browserSync = bsCreate();
const sass = gulpSass(dartSass);

const optimizeImage = () => {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images/'))
        .pipe(browserSync.stream());
};

const buildCss = () => {
    return gulp.src('./src/scss/style.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: false,
            })
        )
        .pipe(cleanCss({}))
        .pipe(
            rename({
                suffix: '.min',
                extname: '.css',
            })
        )
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
};

const buildJs = () => {
    return gulp.src('./src/js/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(minifyjs())
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
};

const server = () => {
    browserSync.init({
        server: {
            baseDir: './',
        },
    });
};

const watchCss = () => {
    gulp.watch('./src/scss/**/*', buildCss);
};

const watchJs = () => {
    gulp.watch('./src/js/**/*.js', buildJs);
};

const watchImg = () => {
    gulp.watch('./src/img/*', optimizeImage);
};

gulp.task('default', gulp.parallel(server, optimizeImage, watchImg, buildCss, watchCss, buildJs, watchJs));


