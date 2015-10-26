
gulp = require 'gulp'
require './test-specs-js-ts'
require './test-lint'

gulp.task 'test', [
  'test-specs-js-ts'
  'test-lint'
], ->
  process.exit 0
