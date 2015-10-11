
gulp = require 'gulp'
paths = require '../config/paths'
server = require 'gulp-develop-server'
require './build-js'

gulp.task 'develop-js', ['build-js'], ->
  if server.child
    server.restart()
  else
    server.listen {
      path: paths.back.mainFile,
      env: {
        PORT: process.env.PORT || 8083
      }
    }
    process.on 'exit', ->
      server.kill()
