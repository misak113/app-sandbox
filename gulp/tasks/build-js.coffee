
gulp = require 'gulp'
require './build-js-back'
require './build-js-front'

gulp.task 'build-js', [
  'build-js-back'
  'build-js-front'
]
