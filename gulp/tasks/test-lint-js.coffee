
gulp = require 'gulp'
require './test-lint-js-ts'

gulp.task 'test-lint-js', ['test-lint-js-ts']
