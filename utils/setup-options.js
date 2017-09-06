'use strict';

/**
 * Config render options
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const lodash = require('lodash');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Object} opts - user options
 * @param {Buffer} file - current file
 * @param {string} file.path - absolute file path
 * @param {string} file.extname - file extension
 * @param {Object} file.sourceMap - plugin source-map data
 * @returns {Object} options
 */
function setupOptions (opts, file) {
	const options = lodash.cloneDeep(opts);

	// set the file path for libsass
	options.file = file.path;

	// Ensure `indentedSyntax` is true if a `.sass` file
	if (path.extname(file.path) === '.sass') {
		options.indentedSyntax = true;
	}

	// Ensure file's parent directory in the include path
	if (typeof options.includePaths === 'string') {
		options.includePaths = [opts.includePaths];
	}
	if (!Array.isArray(options.includePaths)) {
		options.includePaths = [];
	}
	options.includePaths.unshift(path.dirname(file.path));

	// Generate Source Maps if plugin source-map present
	if (file.sourceMap) {
		options.sourceMap = file.path;
		options.omitSourceMapUrl = true;
		options.sourceMapContents = true;
	}

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;
