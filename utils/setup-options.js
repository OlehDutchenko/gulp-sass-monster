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
 * @param {Buffer} file.contents
 * @param {string} file.path - absolute file path
 * @param {string} file.extname - file extension
 * @param {Object} file.sourceMap - plugin source-map data
 * @returns {Object} options
 * @sourceCode
 */
function setupOptions (opts, file) {
	const options = lodash.cloneDeep(opts);

	// set the file path for libsass
	options.file = file.path;
	options.data = file.contents.toString();

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
	} else {
		delete options.sourceMap;
		delete options.omitSourceMapUrl;
		delete options.sourceMapContents;
	}

	if (options.addVariables) {
		let vars = JSON.parse(JSON.stringify(options.addVariables));
		let varsList = [];
		let generated = '/* generated */ %s';

		for (let key in vars) {
			let value = vars[key];
			let variable;

			switch (typeof value) {
				case 'object':
					if (value === null) {
						break;
					}
					let list = [];

					if (Array.isArray(value)) { // create SASS list
						value.forEach(val => {
							if (typeof val === 'object') {
								return false;
							}
							list.push(val);
						});
					} else { // create SASS map
						for (let prop in value) {
							let val = value[prop];
							if (typeof val === 'object') {
								return false;
							}
							list.push(prop + ': ' + val);
						}
					}

					if (list.length) {
						variable = `$${key}: (${list.join(', ')});`;
					}
					break;

				default:
					// example -> $var: 2rem;
					variable = `$${key}: ${value};`;
			}

			if (variable) {
				varsList.push(generated.replace(/%s/, variable));
			}

			if (varsList.length) {
				let fileContent = options.data;
				let charsetRegexp = /(@charset.+;)/i;
				varsList = varsList.join('\n');

				// if has charset
				if (charsetRegexp.test(fileContent)) {
					fileContent = fileContent.replace(charsetRegexp, (str, group) => `${group}\n${varsList}\n`);
				} else {
					fileContent = `${varsList}\n${fileContent}`;
				}

				// new content
				options.data = fileContent;
			}
		}
	}

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;
