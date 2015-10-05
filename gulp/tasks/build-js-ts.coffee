
gulp = require 'gulp'
ts = require 'gulp-typescript'
merge = require 'merge2'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'
require './build-js-ts-tsd'

gulp.task 'build-js-ts', ['build-js-ts-tsd'], ->
  tsProject = ts.createProject paths.ts.config
  files = paths.ts.src.concat([
    paths.tsd.src
  ])
  tsResult = gulp.src(files)
    .pipe plumber(errorHandler)
    .pipe ts(tsProject)
  return merge [
    tsResult.dts.pipe(gulp.dest(paths.dist + '/definitions'))
    tsResult.js.pipe(gulp.dest(paths.dist + '/js'))
  ]
