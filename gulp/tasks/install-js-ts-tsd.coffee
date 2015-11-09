
gulp = require 'gulp'
util = require 'gulp-util'
tsd = require 'gulp-tsd'
paths = require '../config/paths'
fs = require 'fs'
lastTsdChecksum = null

gulp.task 'install-js-ts-tsd', (callback) ->
  tsdChecksum = (fs.readFileSync paths.tsd.config).toString()
  if lastTsdChecksum != tsdChecksum
    util.log 'tsd reinstall'
    lastTsdChecksum = tsdChecksum
    tsd({
      command: 'reinstall',
      config: paths.tsd.config
    }, callback)
  else
    util.log 'tsd skip no changes'
    callback()
