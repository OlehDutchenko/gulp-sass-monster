'use strict';

/**
 * Описание модуля
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const gutil = require('gulp-util');
const applySourceMap = require('vinyl-sourcemaps-apply');

// ----------------------------------------
// Private
// ----------------------------------------

// в этой части файла создаються и описываються
// вспомогательные значения и методы, который будут использованы
// внутри вашего основного кода, ради которого создан этот файл
// Также слово приватный - обозначает что эти значения и методы
// не будут доступны за пределами этого файла

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Handles returning the file to the stream
 * @param {Buffer} file - current file
 * @param {Buffer} file.contents
 * @param {string} file.extname
 * @param {string} file.relative
 * @param {Object} result - node-sass render result
 * @param {Object} options - render options
 * @param {Function} cb - stream callback
 * @sourceCode
 */
function pushFile (file, result, options, cb) {
	if (typeof options.afterRender === 'function') {
		options.afterRender(result, file);
	}

	// Build Source Maps!
	if (result.map) {
		// Transform map into JSON
		let sassMap = JSON.parse(result.map.toString());

		// Grab the stdout and transform it into stdin
		let sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');

		// Grab the base file name that's being worked on
		let sassFileSrc = file.relative;

		// Grab the path portion of the file that's being worked on
		let sassFileSrcPath = path.dirname(sassFileSrc);

		if (sassFileSrcPath) {
			// Prepend the path to all files in the sources array except the file that's being worked on
			let sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
			sassMap.sources = sassMap.sources.map((source, index) => {
				return (index === sourceFileIndex) ? source : path.join(sassFileSrcPath, source);
			});
		}

		// Remove 'stdin' from sources and replace with filenames!
		sassMap.sources = sassMap.sources.filter(src => {
			if (src !== 'stdin') {
				return src;
			}
		});

		// Replace the map file with the original file name (but new extension)
		sassMap.file = gutil.replaceExtension(sassFileSrc, '.css');

		// Apply the map
		applySourceMap(file, sassMap);
	}

	file.contents = result.css;
	file.extname = '.css';

	cb(null, file);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = pushFile;
