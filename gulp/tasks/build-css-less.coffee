
gulp = require 'gulp'
less = require 'gulp-less'
paths = require '../config/paths'

gulp.task 'build-css-less', ->
  return gulp.src([paths.less.src])
    .pipe less()
    .pipe gulp.dest(paths.dist + '/css')
