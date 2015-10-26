
gulp = require 'gulp'
plumber = require 'gulp-plumber'
jasmine = require 'gulp-jasmine'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'
coverage = require '../lib/coverage'
require './build-specs-js-ts'
require './prepare-coverage-js-ts'

gulp.task 'test-specs-js-ts', ['build-specs-js-ts', 'prepare-coverage-js-ts'], ->
  specFiles = paths.dist + '/js/specs/**/*Spec.js'
  gulp.src specFiles
    .pipe plumber(errorHandler)
    .pipe jasmine()
    .pipe coverage.writeReports()
    .pipe coverage.enforceThresholds()
