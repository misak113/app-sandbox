
gulp = require 'gulp'
require './watch-js'
require './watch-css'

gulp.task 'watch', [
  'watch-js'
  'watch-css'
]
