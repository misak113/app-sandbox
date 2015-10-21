
gulp = require 'gulp'
tslint = require 'gulp-tslint'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'

gulp.task 'test-lint-js-ts', ->
  return gulp.src paths.ts.src
    .pipe tslint({
      config: paths.ts.lint.config
      tslint: require 'tslint'
    })
    .pipe tslint.report('prose', {
      emitError: false
    })
