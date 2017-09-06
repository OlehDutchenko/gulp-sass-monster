'use strict';

/**
 * Render options
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

const options = {
	default: {

	},
	'output-style--expanded': {
		outputStyle: 'expanded'
	},
	'output-style--compact': {
		outputStyle: 'compact'
	},
	'output-style--compressed': {
		outputStyle: 'compressed'
	},
	'indent-type--space-4': {
		indentWidth: '4'
	},
	'indent-type--tab-4': {
		indentType: 'tab',
		indentWidth: '4'
	},
	'source-maps': {
		sourceMap: true
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = options;
