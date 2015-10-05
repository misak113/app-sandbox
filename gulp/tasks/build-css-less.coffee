
gulp = require 'gulp'
less = require 'gulp-less'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'

gulp.task 'build-css-less', ->
  return gulp.src([paths.less.src])
    .pipe plumber(errorHandler)
    .pipe less()
    .pipe gulp.dest(paths.dist + '/css')
