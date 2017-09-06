'use strict';

/**
 * @fileOverview Testing
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const gulp = require('gulp');
const del = require('del');
const gulpSassMonster = require('../index');
const mocha = require('gulp-mocha');

// modules
const options = require('./options');

// ----------------------------------------
// Private
// ----------------------------------------

const series = ['clear'];
const dest = './gulp-results';
const src = './scss/!(_)*.scss';

// ----------------------------------------
// Tasks
// ----------------------------------------

gulp.task('clear', function (done) {
	return del(dest).then(paths => done(), error => console.log(error.message));
});

gulp.task('tmp', function () {
	return gulp.src(src)
		.pipe(gulpSassMonster({}, true))
		.pipe(gulp.dest('./tmp/'));
});

for (let preset in options) {
	let config = options[preset];
	let taskName = `preset-${preset}`;
	let taskDest = `${dest}/${preset}`;
	series.push(taskName);

	gulp.task(taskName, function () {
		return gulp.src(src)
			.pipe(gulpSassMonster(config))
			.on('data', file => {
				file.extname = '.css';
			})
			.pipe(gulp.dest(taskDest));
	});
}

gulp.task('sass', gulp.series(...series));

gulp.task('compare-results', function () {
	return gulp.src('./compare.js', {read: false})
		.pipe(mocha({
			reporter: 'spec'
		}))
		.once('error', () => {
			process.exit(1);
		});
});
