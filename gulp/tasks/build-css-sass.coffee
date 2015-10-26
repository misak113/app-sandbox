
gulp = require 'gulp'
sass = require 'gulp-sass'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'

gulp.task 'build-css-sass', ->
  return gulp.src([paths.sass.src])
    .pipe plumber(errorHandler)
    .pipe sass({
      outputStyle: 'compressed'
    })
    .pipe gulp.dest(paths.dist + '/css')
