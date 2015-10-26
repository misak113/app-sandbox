
gulp = require 'gulp'
plumber = require 'gulp-plumber'
istanbul = require 'gulp-istanbul'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'
require './build-js-ts'

gulp.task 'prepare-coverage-js-ts', ['build-js-ts'], ->
  srcFiles = paths.dist + '/js/src/**/*.js'
  gulp.src(srcFiles)
    .pipe plumber(errorHandler)
    .pipe istanbul()
    .pipe istanbul.hookRequire()
