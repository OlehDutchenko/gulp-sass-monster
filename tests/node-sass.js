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

const destPath = path.resolve(path.join(__dirname, './node-results'));
const sassFiles = glob.sync(path.join(__dirname, './scss/!(_|error)*.scss'));

// ----------------------------------------
// Public
// ----------------------------------------

del.sync(destPath);
fs.mkdirSync(destPath);

for (let preset in options) {
	sassFiles.forEach(file => {
		let filename = path.basename(file, '.scss');
		let filepath = path.join(destPath, filename + '.css');
		let config = lodash.merge({}, options[preset], {file});
		let result = sass.renderSync(config);
		fs.writeFileSync(filepath, result.css);
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла
