
gulp = require 'gulp'
require './test-specs-js-ts'

gulp.task 'test', [
  'test-specs-js-ts'
]
