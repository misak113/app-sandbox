
gulp = require 'gulp'
paths = require '../config/paths'
require './build-js'
require './develop-js'

gulp.task 'watch-js', ['build-js', 'develop-js'], ->
  process.env.GULP_ENV = "watch"
  files = paths.ts.src.concat([
    paths.tsd.src
  ])
  return gulp.watch files, ['build-js', 'develop-js']
