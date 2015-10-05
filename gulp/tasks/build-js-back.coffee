
gulp = require 'gulp'
require './build-js-ts'

gulp.task 'build-js-back', [
  'build-js-ts'
]
