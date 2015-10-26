
gulp = require 'gulp'
paths = require '../config/paths'
require './build-css-sass'

gulp.task 'watch-css-sass', ['build-css-sass'], ->
  process.env.GULP_ENV = "watch"
  return gulp.watch [paths.sass.watch], ['build-css-sass']
