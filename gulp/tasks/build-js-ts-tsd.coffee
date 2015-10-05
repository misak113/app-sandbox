
gulp = require 'gulp'
tsd = require 'gulp-tsd'
paths = require '../config/paths'

gulp.task 'build-js-ts-tsd', (callback) ->
  tsd({
    command: 'reinstall',
    config: paths.tsd.config
  }, callback)
