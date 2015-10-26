
paths = require '../config/paths'
istanbul = require 'gulp-istanbul'

exports.writeReports = ->
  istanbul.writeReports({
    dir: paths.reports.coveragePath
    reporters: ['lcov']
    reportOpts: { dir: paths.reports.coveragePath }
  })

exports.enforceThresholds = ->
  istanbul.enforceThresholds({
    thresholds: {
      global: 50
      each: 10
    }
  })
