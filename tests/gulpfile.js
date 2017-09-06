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

// modules
const options = require('./options');

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Tasks
// ----------------------------------------

gulp.task('sync', function () {
	return gulp.src('./scss/*.scss')
		// .pipe(gulpSassMonster())
		.pipe(gulp.dest('./gulp-results/'));
});

gulp.task('clear', function (done) {
	return del('./gulp-results').then(paths => done(), error => console.log(error.message));
});

gulp.task('sass', gulp.series('clear', 'sync'));
