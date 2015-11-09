
gulp = require 'gulp'
require './build-js'
require './build-css'

gulp.task 'build', [
  'build-js'
  'build-css'
]
