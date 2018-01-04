'use strict';

/**
 * Handles error message
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.1.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const colors = require('ansi-colors');
const PluginError = require('plugin-error');

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
		colors.underline(relativePath),
		'',
		error.formatted
	].join('\n');

	return new PluginError(pkg.name, msg);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = errorHandler;
