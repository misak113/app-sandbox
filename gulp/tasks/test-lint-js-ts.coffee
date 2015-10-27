
gulp = require 'gulp'
tslint = require 'gulp-tslint'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'

gulp.task 'test-lint-js-ts', ->
  files = paths.ts.src.concat(paths.ts.specs)
  return gulp.src files
    .pipe plumber(errorHandler)
    .pipe tslint({
      config: paths.ts.lint.config
      tslint: require 'tslint'
    })
    .pipe tslint.report('prose', {
      emitError: false
    })
