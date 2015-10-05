
basePath = __dirname + '/../..'
npmConfig = require basePath + '/package.json'

paths = {
  basePath: basePath
  dist: basePath + '/dist'
  front:
    mainFile: basePath + '/front.js'
  back:
    mainFile: basePath + '/' + npmConfig.main
  ts:
  	config: basePath + '/tsconfig.json'
  	src: [
      basePath + '/src/**/*.ts'
      basePath + '/src/**/*.tsx'
    ]
  tsd:
  	config: basePath + '/tsd.json'
  	src: basePath + '/typings/tsd.d.ts'
  less:
    src: basePath + '/src/index.less'
}
module.exports = paths
