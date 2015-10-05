
gulp = require 'gulp'
paths = require '../config/paths'
server = require 'gulp-develop-server'
require './build-js'

gulp.task 'develop-js', ['build-js'], ->
  server.listen {
    path: paths.back.mainFile
  }

module.exports.restart = server.restart
