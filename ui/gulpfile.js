/* eslint-disable @typescript-eslint/no-var-requires */
const { src, dest, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

function styles() {
	return src('gulp/scss/**/*.scss')
	.pipe(sass())
	.pipe(concat('style.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }, format: 'beautify' }))
	.pipe(dest('public/'))
}
	
function startwatch() {
	watch('gulp/scss/**/*', styles);
}

exports.styles = styles;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, startwatch);