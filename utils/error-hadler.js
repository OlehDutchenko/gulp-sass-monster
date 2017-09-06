'use strict';

/**
 * Handles error message
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const gutil = require('gulp-util');

// data
const pkg = require('../package.json');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Error} error
 * @param {string} error.file
 * @param {Buffer} file
 * @param {string} file.path
 * @returns {Error}
 * @sourceCode
 */
function errorHandler (error, file) {
	let filePath = (error.file === 'stdin' ? file.path : error.file) || file.path;
	let relativePath = path.relative(process.cwd(), filePath);

	let msg = [
		gutil.colors.underline(relativePath),
		'',
		error.formatted
	].join('\n');

	return new gutil.PluginError(pkg.name, msg);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = errorHandler;
