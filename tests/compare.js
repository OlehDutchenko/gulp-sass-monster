'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const assert = require('assert');
const chalk = require('chalk');

// data
const pkg = require('../package.json');
const options = require('./options');

// ----------------------------------------
// Private
// ----------------------------------------

function showConfig (config) {
	let str = JSON.stringify(config, null, '  ').split('\n');

	str.forEach((line, i) => {
		str[i] = '    ' + line;
	});

	return str.join('\n') + '\n';
}

// ----------------------------------------
// Public
// ----------------------------------------

describe(chalk.white('compare results'), function () {
	for (let preset in options) {
		let config = options[preset];
		let mapPattern = /\/\*# sourceMappingURL=.*\*\/(\n)*/gi;

		describe(chalk.yellow(`preset ${preset}\n`) + chalk.gray(showConfig(config)), function () {
			const gulpResults = glob.sync(path.join(__dirname, 'gulp-results', preset, './*.css'));
			const nodeResults = glob.sync(path.join(__dirname, 'node-results', preset, './*.css'));

			nodeResults.forEach((file, i) => {
				let filename = path.basename(file, '.css') + '.scss';
				let nodeCss = fs.readFileSync(file).toString().replace(mapPattern, '');
				let gulpCss = fs.readFileSync(gulpResults[i]).toString().replace(mapPattern, '');

				it(`${filename} - ${pkg.name} render should be same as node-sass render`, function () {
					assert.strictEqual(gulpCss, nodeCss);
				});
			});
		});
	}
});

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла
