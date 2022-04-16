const { watch, src, dest, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')

function styles() {
	return src('./src/scss/style.scss', { allowEmpty: true })
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(dest('./css'))
}

function watcher() {
	watch('./src/**/*.scss', styles)
}

exports.default = parallel(styles, watcher)
