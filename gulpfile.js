'use strict';

/**
 * @fileOverview Testing
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const del = require('del');

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Tasks
// ----------------------------------------

gulp.task('sync', function () {
	return gulp.src('./tests/scss/*.scss')
		.pipe(gulp.dest('./tests/result/sync/'));
});

gulp.task('async', function () {
	return gulp.src('./tests/scss/*.scss')
		.pipe(gulp.dest('./tests/result/async/'));
});

gulp.task('clear', function (done) {
	return del('./tests/result').then(paths => done(), error => console.log(error.message));
});

gulp.task('sass', gulp.series('clear', 'sync', 'async'));
