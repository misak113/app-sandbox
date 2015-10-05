
gulp = require 'gulp'
paths = require '../config/paths'
require './build-js'
develop = require './develop-js'

gulp.task 'watch-js', ['build-js', 'develop-js'], ->
  files = paths.ts.src.concat([
    paths.tsd.src
  ])
  return gulp.watch files, ['build-js', develop.restart]
