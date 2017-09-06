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
// Public
// ----------------------------------------

describe(chalk.white('compare results'), function () {
	for (let preset in options) {
		describe(chalk.yellow(`preset ${preset}`), function () {
			const gulpResults = glob.sync(path.join(__dirname, 'gulp-results', preset, './*.css'));
			const nodeResults = glob.sync(path.join(__dirname, 'node-results', preset, './*.css'));

			gulpResults.forEach((file, i) => {
				let filename = path.basename(file, '.css') + '.scss';
				let gulpCss = fs.readFileSync(file).toString();
				let nodeCss = fs.readFileSync(nodeResults[i]).toString();

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
