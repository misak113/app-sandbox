
gulp = require 'gulp'
paths = require '../config/paths'
watchLess = require 'gulp-watch-less'
require './build-css-less'

gulp.task 'watch-css-less', ['build-css-less'], ->
  process.env.GULP_ENV = "watch"
  return watchLess [paths.less.src], -> gulp.run 'build-css-less'
