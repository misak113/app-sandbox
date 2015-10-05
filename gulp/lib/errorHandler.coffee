gulp = require 'gulp'
clc = require 'cli-color'

# Handling whatever error in whole streams to return bash exit(1)
module.exports = exports = errorHandler = (e) ->
	console.error clc.red(e.message)
	if process.env.GULP_ENV != 'watch'
		process.emit 'exit', e

module.exports.handleStreamError = exports.handleStreamError = (e) ->
	this.emit('end')

process.on 'exit', (e) =>
	process.nextTick =>
		process.exit if e then 1 else 0
