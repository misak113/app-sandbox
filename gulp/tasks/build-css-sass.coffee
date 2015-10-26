
gulp = require 'gulp'
sass = require 'gulp-sass'
sourcemaps = require 'gulp-sourcemaps'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'

gulp.task 'build-css-sass', ->
  return gulp.src([paths.sass.src])
    .pipe plumber(errorHandler)
    .pipe sourcemaps.init()
    .pipe sass({
      outputStyle: 'compressed'
    })
    .pipe sourcemaps.write('.')
    .pipe gulp.dest(paths.dist + '/css')
