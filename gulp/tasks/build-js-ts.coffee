
gulp = require 'gulp'
ts = require 'gulp-typescript'
merge = require 'merge2'
plumber = require 'gulp-plumber'
errorHandler = require '../lib/errorHandler'
paths = require '../config/paths'
require './install-js-ts-tsd'

gulp.task 'build-js-ts', ['install-js-ts-tsd'], ->
  tsProject = ts.createProject paths.ts.config
  files = paths.ts.src.concat([
    paths.tsd.src
  ])
  tsResult = gulp.src(files, { base: paths.basePath })
    .pipe plumber(errorHandler)
    .pipe ts(tsProject)
  return merge [
    tsResult.dts.pipe(gulp.dest(paths.dist + '/definitions'))
    tsResult.js.pipe(gulp.dest(paths.dist + '/js'))
  ]
