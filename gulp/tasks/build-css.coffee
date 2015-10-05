
gulp = require 'gulp'
require './build-css-less'

gulp.task 'build-css', [
  'build-css-less'
]
