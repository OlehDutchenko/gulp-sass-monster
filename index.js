'use strict';

/**
 * > Gulp plugin for [node-sass](https://github.com/sass/node-sass) with steroids. The project is inspired by [gulp-sass](https://github.com/dlmanning/gulp-sass)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const sass = require('node-sass');
const chalk = require('chalk');
const lodash = require('lodash');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');

// data
const pkg = require('./package.json');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Create new plugin error
 * @const {Function}
 * @param {Object} data
 * @param {Object} [options={}]
 * @return {PluginError}
 */
const pluginError = (data, options) => new gutil.PluginError(pkg.name, data, options);

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Core plugin method
 * @param {Object} [opts={}]
 * @returns {DestroyableTransform}
 */
function gulpSassMonster (opts = {}) {}

/**
 * Plugin name
 * @type {string}
 */
gulpSassMonster.pluginName = pkg.name;

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpSassMonster;
