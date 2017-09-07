# gulp-sass-monster

![wip](https://img.shields.io/badge/Status-W.I.P-red.svg)
![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-sass-monster.svg?branch=dev)](https://travis-ci.org/dutchenkoOleg/gulp-sass-monster)
 
 
:us: English
|
:ru: [Русский язык](https://github.com/dutchenkoOleg/gulp-sass-monster/blob/master/README-RU.md)

> _Gulp plugin for [node-sass](https://github.com/sass/node-sass) with steroids. The project is a revised version [gulp-sass](https://github.com/dlmanning/gulp-sass) and updated [gulp-sass-extended](https://github.com/dutchenkoOleg/gulp-sass-extended), which is no longer supported_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)

## Installation

```shell
npm i --save gulp-sass-monster
# or using yarn cli
yarn add gulp-sass-monster
```

## Usage example

```js
const gulp = require('gulp');
const sassMonster = require('gulp-sass-monster');
const options = {};
const isSync = true;

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sassMonster(options, isSync).on('error', sassMonster.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass')); // gulp#4.x
});
```

---

## Options

You can use the same parameters as for [`node-sass`](https://github.com/sass/node-sass#options).  
Two parameters are an exception - [`file`](https://github.com/sass/node-sass#file) and [`data`](https://github.com/sass/node-sass#data), they are setting by the plugin.

### Extra options

#### `addVariables`

_type_ `Object`
|
_default_ `undefined`

Adds custom variables to the renderer.

> This parameter is useful only if you compute some values and want to add their result to sass render. 
> Static properties are easier to set in the files themselves.

A few details about the values for this option:

- each property will be a Sass variable;
- If the property is an array, it will be [Sass list](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#lists);
- If the property is an object, it will be [Sass map](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps);

___Note.___ You should not have more than one level of nesting in objects and arrays. Otherwise, you may receive incorrect data.

Example:

```js
const gulp = require('gulp');
const sassMonster = require('gulp-sass-monster');
const sourcemaps = require('gulp-sourcemaps');
const options = {
    addVariables: {
        PRODUCTION: yourProductionValue, // true for example
        someOtherDynamicVar: calculatedValue, // '12px' for example 
        myColorsMap: {
            color1: 'blue',
            color2: 'yellow',
        },
        pointList: [
            '1024px',
            '1280px',
            '1366px'
        ]
    }
};
const isSync = true;

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sassMonster(options, isSync).on('error', sassMonster.logError))
        .pipe(gulp.dest('./css'));
});
```

Before sending to the render, the corresponding code will be added to the body of the files

```scss
/* generated */ $PRODUCTION: true;
/* generated */ $someOtherDynamicVar: 12px;
/* generated */ $myColorsMap: (color1: blue, color2: yellow);
/* generated */ $pointList: (1024px, 1280px, 1366px);
/// then your code from file 
```

If the file contains a `@charset` (which by specification can only be found at the beginning of the file), a block of variables will be inserted after it.

___Impact on sourcemaps.___  You will notice some inconsistencies in the line numbers in the generated sourcemaps and the original files. The more you add variables, the more this discrepancy, since your content will be shifted due to the addition of a block of variables.

#### `afterRender(result, file)`

_type_ `function`
|
_default_ `undefined`

Аргументы

- `result {Object}` - [node-sass render result](https://github.com/sass/node-sass#result-object)
- `file {Buffer}` - current file

The method is called after a successful render. It is important to know that after this method, there is an internal processing of the data `result` and compiling `sourcemaps` (if necessary), if you make changes to the `result` - this will affect the overall result of the plug-in. Use it carefully.

___Example of setting additional watches only on imported files___

```js
const gulp = require('gulp');
const sassMonster = require('gulp-sass-monster');
const gulpWatchAndTouch = require('gulp-watch-and-touch');

const sassFileWatcher = gulpWatchAndTouch(gulp);
const options = {
    afterRender (result, file) {
        let filePath = file.path;
        let sources = result.stats.includedFiles;
        let newImports = sassFileWatcher(filePath, filePath, sources);
        if (newImports) {
            console.log(`${file.stem} has new imports`);
        }
    }
};
const isSync = true;

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sassMonster(options, isSync).on('error', sassMonster.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass')); // gulp#4.x
});
```

## isSync

The second argument is the sync renderer flag. If you do not specify it as a positive value, an asynchronous render will be performed.

---

## Source Maps

The plugin supports [`gulp-sourcemaps`](https://github.com/gulp-sourcemaps/gulp-sourcemaps).

```js
const gulp = require('gulp');
const sassMonster = require('gulp-sass-monster');
const sourcemaps = require('gulp-sourcemaps');
const options = {};
const isSync = true;

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sassMonster(options, isSync).on('error', sassMonster.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});
```

---

## Sass Rendering Errors

`gulp-sass-monster` is just a wrapper for preparing files and parameters that are passed to the [`node-sass`](https://github.com/sass/node-sass) render and also performs the processing of its results.

If you have questions or problems with how Sass works, you should refer to the corresponding [`node-sass`](https://github.com/sass/node-sass) and [`libsass`](https://github.com/sass/libsass) projects.

If you have problems with the work of the plugin `gulp-sass-monster` - then go here [`gulp-sass-monster/issues`](https://github.com/dutchenkoOleg/gulp-sass-monster/issues).

---

## Project Info

* [Change log](https://github.com/dutchenkoOleg/gulp-sass-monster/blob/master/CHANGELOG.md)
* [Contributing Guidelines](https://github.com/dutchenkoOleg/gulp-sass-monster/blob/master/CONTRIBUTING.md)
* [Contributor Covenant Code of Conduct](https://github.com/dutchenkoOleg/gulp-sass-monster/blob/master/CODE_OF_CONDUCT.md)
* [License MIT](https://github.com/dutchenkoOleg/gulp-sass-monster/blob/master/LICENSE)
