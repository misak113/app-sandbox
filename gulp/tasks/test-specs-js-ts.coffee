
gulp = require 'gulp'
plumber = require 'gulp-plumber'
jasmine = require 'gulp-jasmine'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'
require './build-specs-js-ts'

gulp.task 'test-specs-js-ts', ['build-specs-js-ts'], ->
  files = paths.dist + '/js/**/*Spec.js'
  gulp.src(files)
    .pipe plumber(errorHandler)
    .pipe jasmine()
