
gulp = require 'gulp'
require './build-js'
require './build-css'
require './install-js-ts-tsd'

gulp.task 'build', [
  'install-js-ts-tsd'
  'build-js'
  'build-css'
]
