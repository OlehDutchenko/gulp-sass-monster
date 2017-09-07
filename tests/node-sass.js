'use strict';

const del = require('del');
/**
 * Описание модуля
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const lodash = require('lodash');
const sass = require('node-sass');

// modules
const options = require('./options');

// ----------------------------------------
// Private
// ----------------------------------------

const destPath = path.resolve(path.join(__dirname, './results-node'));
const sassFiles = glob.sync(path.join(__dirname, './scss-examples/!(_)*.scss'));

// ----------------------------------------
// Public
// ----------------------------------------

del.sync(destPath);
fs.mkdirSync(destPath);

for (let preset in options) {
	fs.mkdirSync(path.join(destPath, preset));

	sassFiles.forEach(file => {
		let filename = path.basename(file, '.scss');
		let filepath = path.join(destPath, preset, filename + '.css');
		let config = lodash.merge({}, options[preset], {file});
		delete config.afterRender;
		delete config.addVariables;
		delete config.data;

		delete config.data;
		if (config.sourceMap) {
			config.outFile = filepath;
		}

		let result = sass.renderSync(config);

		fs.writeFileSync(filepath, result.css);
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла
