# gulp-sass-monster

![wip](https://img.shields.io/badge/Status-W.I.P-red.svg)
![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-sass-monster.svg?branch=dev)](https://travis-ci.org/dutchenkoOleg/gulp-sass-monster)


:us: [English](./README.md)
|
:ru: Русский язык

> _Gulp плагин для [node-sass](https://github.com/sass/node-sass) со стероидами. Проект является переработанной версией [gulp-sass](https://github.com/dlmanning/gulp-sass) и обновлением [gulp-sass-extended](https://github.com/dutchenkoOleg/gulp-sass-extended), который больше не поддерживается_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)

## Установка

```shell
npm i --save gulp-sass-monster
# or using yarn cli
yarn add gulp-sass-monster
```

## Пример использования

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

## Параметры

Вы можете использовать те же самые параметры как и для [`node-sass`](https://github.com/sass/node-sass#options).  
Исключением являются два параметра - [`file`](https://github.com/sass/node-sass#file) и [`data`](https://github.com/sass/node-sass#data), которые устанавливает плагин.

### Дополнительные параметры

#### `addVariables`

_тип данных_ `Object`
|
_по умолчанию_ `undefined`

Добавляет пользовательские переменные в рендер.

> Этот параметр полезен, только если вы вычисляете некоторые значения и хотите добавить их результат в sass render.  
> Статические свойства проще устанавливать в самих файлах.

Немного подробностей о значениях для этой опции:

- каждое свойство будет переменной Sass;
- если свойство будет массивом - это будет [Sass list](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#lists);
- если свойство будет объектом - это будет [Sass map](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps);

___Примечание.___ У Вас не должно быть более одного уровня вложенности в объектах и массивах. В противном случае Вы можете получить неверные данные.

Пример:

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

Перед отправкой на рендер в тело файлов будет добавлен соответствующий код

```scss
/* generated */ $PRODUCTION: true;
/* generated */ $someOtherDynamicVar: 12px;
/* generated */ $myColorsMap: (color1: blue, color2: yellow);
/* generated */ $pointList: (1024px, 1280px, 1366px);
/// then your code from file 
```

Если файл содержит дериктиву `@charset` (которая по спецификации может находится только в начале файла), блок переменных будет вставлен после нее.

___Влияние на sourcemaps.___  Вы заметите некоторые несоответствия в номерах строк в созданых sourcemaps и оригинальный файлах. Чем больше вы добавляете переменных, тем больше это несоответствие, так как Ваш контент будет сдвинут из-за добавления блока переменных.

#### `afterRender(result, file)`

_тип данных_ `function`
|
_по умолчанию_ `undefined`

Аргументы

- `result {Object}` - результат [рендера node-sass](https://github.com/sass/node-sass#result-object)
- `file {Buffer}` - текущий файл рендера

Метод вызывается после успешного рендера. Важно знать что после этого метода, происходит внутренняя обработка данных `result` и составление `sourcemaps` (при необходимости), если Вы будете вносить изменения в  `result` - это повлияет на общий итоговый результат плагина. Используйте его осторожно.

___Пример установки дополнительных вотчей только на импортируемые файлы___

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

Второй аргумент - это флаг синхроного рендера. Если его не указать как положительное значение - будет выполнен асинхронный рендер.

---

## Source Maps

Плагин поддерживает работу с [`gulp-sourcemaps`](https://github.com/gulp-sourcemaps/gulp-sourcemaps).

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

## Ошибки Sass рендера

`gulp-sass-monster` всего лишь обертка для подготовки файлов и параметров, которые передаются на рендер [`node-sass`](https://github.com/sass/node-sass), а также выполняет обработку его результатов.

Если у Вас есть вопросы или проблемы с тем как работает Sass - Вам следует обращется в соответствующие проэкты [`node-sass`](https://github.com/sass/node-sass) и [`libsass`](https://github.com/sass/libsass).

Если же у Вас проблемы с работой плагина `gulp-sass-monster` - тогда Вам сюда [`gulp-sass-monster/issues`](https://github.com/dutchenkoOleg/gulp-sass-monster/issues).

---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
