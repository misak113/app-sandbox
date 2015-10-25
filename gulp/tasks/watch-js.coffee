
gulp = require 'gulp'
paths = require '../config/paths'
require './build-js'
require './develop-js'
require './test-specs-js'

gulp.task 'watch-js', ['build-js', 'test-specs-js', 'test-lint-js', 'develop-js'], ->
  process.env.GULP_ENV = "watch"
  files = paths.ts.src.concat(
    paths.ts.specs
  ).concat([
    paths.tsd.src
  ])
  return gulp.watch files, ['build-js', 'test-specs-js', 'test-lint-js', 'develop-js']
