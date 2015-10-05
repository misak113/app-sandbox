
gulp = require 'gulp'
browserify = require 'gulp-browserify'
rename = require 'gulp-rename'
paths = require '../config/paths'
require './build-js-ts'

gulp.task 'build-js-front', ['build-js-ts'], ->
  return gulp.src paths.front.mainFile
    .pipe browserify({
      insertGlobals: false
      debug: true
    })
    .pipe(rename('front-bundle.js'))
    .pipe gulp.dest(paths.dist)
