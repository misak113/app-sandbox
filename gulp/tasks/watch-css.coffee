
gulp = require 'gulp'
require './watch-css-less'

gulp.task 'watch-css', [
  'watch-css-less'
]
